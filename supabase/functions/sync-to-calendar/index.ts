import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // Service role key bypasses RLS
    );

    // Get Webhook Payload
    const payload = await req.json();
    const booking = payload.record; // New booking row

    if (!booking) {
      return new Response(JSON.stringify({ error: "No booking record found" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 1. Fetch details of the booked slot
    const { data: slot, error: slotError } = await supabaseClient
      .from("available_slots")
      .select("date, time_slot")
      .eq("id", booking.slot_id)
      .single();

    if (slotError || !slot) {
      throw new Error(`Failed to fetch slot details: ${slotError?.message}`);
    }

    // 2. Parse date and time into start/end ISO strings
    // We assume meeting time slot format is e.g. "10:00 AM" or "02:00 PM"
    const startDateTimeStr = `${slot.date} ${slot.time_slot}`;
    const start = new Date(startDateTimeStr);
    
    // Add 1 hour default duration
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // 3. Authenticate with Google API using Service Account Key stored in secrets
    const googleServiceAccount = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT") ?? "{}");
    if (!googleServiceAccount.client_email || !googleServiceAccount.private_key) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT environment variables in Supabase.");
    }

    // Try to get token with impersonation (needed to generate Google Meet link)
    // We impersonate the official info@bena-tech.com account which has active Workspace delegation
    const impersonationEmail = "info@bena-tech.com";
    let token = "";
    try {
      token = await getGoogleOAuth2Token(
        googleServiceAccount.client_email,
        googleServiceAccount.private_key,
        "https://www.googleapis.com/auth/calendar",
        impersonationEmail
      );
      console.log(`Successfully generated impersonated token for ${impersonationEmail}`);
    } catch (err) {
      console.warn(`Impersonation failed: ${err.message}. Falling back to direct service account auth (No Google Meet links can be created).`);
      token = await getGoogleOAuth2Token(
        googleServiceAccount.client_email,
        googleServiceAccount.private_key,
        "https://www.googleapis.com/auth/calendar"
      );
    }

    // Parse primary client emails
    const clientEmails: string[] = [];
    if (booking.email) {
      booking.email
        .split(/[,;]+/)
        .map((e: string) => e.trim())
        .forEach((e: string) => {
          if (e && !clientEmails.includes(e)) {
            clientEmails.push(e);
          }
        });
    }

    // Parse guest list (names & emails)
    const guests = booking.guests || [];
    const guestEmails = guests
      .map((g: any) => g.email?.trim())
      .filter(Boolean);

    // List of admins to invite and email
    const adminEmails = [
      "a.nasser@bena-tech.com",
      "Dareen@bena.tech.com",
      Deno.env.get("ADMIN_EMAIL_1") ?? "",
      Deno.env.get("ADMIN_EMAIL_2") ?? ""
    ]
      .map((e: string) => e.trim())
      .filter(Boolean);

    // Combine all unique emails (case-insensitive deduplication)
    const allEmailsMap = new Map();
    clientEmails.forEach(e => allEmailsMap.set(e.toLowerCase(), e));
    guestEmails.forEach((e: string) => allEmailsMap.set(e.toLowerCase(), e));
    adminEmails.forEach(e => allEmailsMap.set(e.toLowerCase(), e));

    const uniqueEmails = Array.from(allEmailsMap.values());
    const attendees = uniqueEmails.map(email => ({ email }));

    // Build guest list text for description
    let guestListText = "";
    if (guests.length > 0) {
      guestListText = "\n\nGuests Joining:\n" + guests.map((g: any) => `- ${g.name || "Unnamed"} (${g.email})`).join("\n");
    }

    // 4. Create Calendar Event Payload
    const event = {
      summary: `BenaTech Alignment: ${booking.first_name} ${booking.last_name}`,
      description: `Primary Interest: ${booking.interest.toUpperCase()}\nMeeting Type: ${booking.meeting_type === "online" ? "Remote" : "On-site"}\nClient Email: ${booking.email}${guestListText}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "UTC",
      },
      attendees: attendees,
      conferenceData: booking.meeting_type === "online" ? {
        createRequest: {
          requestId: `benatech-${booking.id}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      } : undefined,
    };

    // 5. Call Google Calendar API to insert event
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID") ?? "primary";
    
    let googleRes;
    let googleData;
    
    // Attempt 1: Full event (attendees + Google Meet)
    googleRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );
    googleData = await googleRes.json();

    // Attempt 2: If Attempt 1 failed due to attendees, try without attendees (but keep Meet)
    if (!googleRes.ok && googleData.error?.message?.includes("Service accounts cannot invite attendees")) {
      console.warn("Service account cannot invite attendees without Domain-Wide Delegation. Retrying without attendees...");
      const eventWithoutAttendees = { ...event, attendees: undefined };
      googleRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventWithoutAttendees),
        }
      );
      googleData = await googleRes.json();
    }

    // Attempt 3: If still failing (e.g. due to conferenceData / Google Meet permission), try with no attendees AND no Google Meet
    if (!googleRes.ok) {
      console.warn(`Event creation failed (Code: ${googleRes.status}). Retrying barebones event creation (no attendees, no Google Meet)...`);
      const barebonesEvent = { 
        ...event, 
        attendees: undefined,
        conferenceData: undefined
      };
      googleRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(barebonesEvent),
        }
      );
      googleData = await googleRes.json();
    }

    if (!googleRes.ok) {
      throw new Error(`Google Calendar API Error: ${googleData.error?.message || JSON.stringify(googleData)}`);
    }

    const googleEventId = googleData.id;
    const hangoutLink = googleData.hangoutLink || "";

    // 6. Update booking row with google_event_id
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({ google_event_id: googleEventId })
      .eq("id", booking.id);

    if (updateError) {
      console.error(`Failed to update booking table with Google Event ID: ${updateError.message}`);
    }

    // 7. Send confirmation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const senderEmail = Deno.env.get("SENDER_EMAIL") || "onboarding@resend.dev";
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Bena Tech <${senderEmail}>`,
            to: uniqueEmails,
            subject: "Meeting Confirmation - Bena Tech",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #1f2937;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://bena-tech-trainees.pages.dev/email_banner.png" alt="Bena Tech" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto 24px auto; border-radius: 8px;" />
                  <h2 style="color: #ea580c; font-size: 24px; font-weight: 700; margin: 0;">Meeting Confirmed</h2>
                  <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">Thank you for scheduling a meeting with Bena Tech.</p>
                </div>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h3 style="font-size: 16px; font-weight: 600; margin-top: 0; margin-bottom: 12px; color: #111827;">Meeting Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 120px;">Client Name</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 500; color: #111827;">${booking.first_name} ${booking.last_name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Date</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 500; color: #111827;">${slot.date}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Time Slot</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 500; color: #111827;">${slot.time_slot}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Meeting Type</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 500; color: #111827;">${booking.meeting_type === 'online' ? 'Online (Google Meet)' : 'On-site'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Primary Interest</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 500; color: #111827; text-transform: capitalize;">${booking.interest}</td>
                    </tr>
                    ${hangoutLink ? `
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Meeting Link</td>
                      <td style="padding: 6px 0; font-size: 14px; font-weight: 500; color: #ea580c;"><a href="${hangoutLink}" target="_blank" style="color: #ea580c; text-decoration: none; font-weight: 600;">Go to Google Meet</a></td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                ${hangoutLink ? `
                <div style="text-align: center; margin: 30px 0; padding: 24px; border: 1px dashed #ea580c; border-radius: 12px; background-color: #fffaf7;">
                  <p style="margin: 0 0 12px 0; font-size: 14px; color: #4b5563; font-weight: 600;">Your Google Meet Link:</p>
                  <a href="${hangoutLink}" target="_blank" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);">Join Google Meet</a>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">(The waiting room will open automatically at the scheduled time)</p>
                </div>
                ` : `
                <div style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                  <p>${booking.meeting_type === 'online' ? 'Our team will reach out with the Google Meet link prior to our meeting time.' : 'Our team will reach out with on-site coordination details prior to our meeting time.'}</p>
                </div>
                `}

                <div style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                  <p>If you need to change or reschedule, please reach out to us at <a href="mailto:info@bena-tech.com" style="color: #ea580c; text-decoration: none;">info@bena-tech.com</a> or via WhatsApp.</p>
                </div>

                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                
                <div style="text-align: center; font-size: 12px; color: #9ca3af;">
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} Bena Tech. All rights reserved.</p>
                </div>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          const emailErr = await emailRes.text();
          console.error(`Resend API Error: ${emailErr}`);
        } else {
          console.log(`Successfully sent confirmation email to ${uniqueEmails.join(', ')}`);
        }
      } catch (err) {
        console.error("Failed to send email via Resend:", err);
      }
    } else {
      console.warn("RESEND_API_KEY is not set. Skipping confirmation email.");
    }

    return new Response(JSON.stringify({ success: true, googleEventId }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

// Helper: Sign Google JWT for OAuth 2.0 Access Token
async function getGoogleOAuth2Token(clientEmail: string, privateKey: string, scope: string, subject?: string): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  interface GoogleClaim {
    iss: string;
    scope: string;
    aud: string;
    exp: number;
    iat: number;
    sub?: string;
  }
  const claim: GoogleClaim = {
    iss: clientEmail,
    scope: scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  if (subject) {
    claim.sub = subject;
  }

  // Convert private key format
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKey
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\\n/g, "\n")
    .replace(/\s/g, "");

  const binaryDer = base64ToArrayBuffer(pemContents);
  
  // Import Cryptographic Private Key
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const encodedHeader = base64url(encoder.encode(JSON.stringify(header)));
  const encodedClaim = base64url(encoder.encode(JSON.stringify(claim)));

  const payload = encoder.encode(`${encodedHeader}.${encodedClaim}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, payload);
  const encodedSignature = base64url(new Uint8Array(signature));

  const assertion = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

  // Request Access Token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(`Google Auth error: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64url(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

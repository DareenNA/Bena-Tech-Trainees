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

    const token = await getGoogleOAuth2Token(
      googleServiceAccount.client_email,
      googleServiceAccount.private_key,
      "https://www.googleapis.com/auth/calendar"
    );

    // 4. Create Calendar Event Payload
    const event = {
      summary: `BenaTech Alignment: ${booking.first_name} ${booking.last_name}`,
      description: `Primary Interest: ${booking.interest.toUpperCase()}\nMeeting Type: ${booking.meeting_type === "online" ? "Remote" : "On-site"}\nClient Email: ${booking.email}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "UTC",
      },
      attendees: [
        { email: booking.email },
        { email: Deno.env.get("ADMIN_EMAIL_1") ?? "" }, // Your email
        { email: Deno.env.get("ADMIN_EMAIL_2") ?? "" }, // Partner email
      ].filter(a => a.email), // Filter out empty emails
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

    // 6. Update booking row with google_event_id
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({ google_event_id: googleEventId })
      .eq("id", booking.id);

    if (updateError) {
      console.error(`Failed to update booking table with Google Event ID: ${updateError.message}`);
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
async function getGoogleOAuth2Token(clientEmail: string, privateKey: string, scope: string): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

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

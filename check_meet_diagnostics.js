import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read service account key
const serviceAccountPath = 'C:/Users/User/Downloads/benatech-calendar-c7a2fe47dc18.json';
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
  console.log(`Successfully loaded service account: ${serviceAccount.client_email}`);
} catch (e) {
  console.error("Could not read service account JSON file:", e.message);
  process.exit(1);
}

// Read .env file manually from the current directory
const envPath = path.resolve('.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error("Error: Could not read .env file.");
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: Sign Google JWT for OAuth 2.0 Access Token
import crypto from 'crypto';

function getGoogleOAuth2Token(clientEmail, privateKey, scope, subject) {
  return new Promise((resolve, reject) => {
    try {
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
      if (subject) {
        claim.sub = subject;
      }

      const base64url = (str) => {
        return Buffer.from(str)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };

      const encodedHeader = base64url(JSON.stringify(header));
      const encodedClaim = base64url(JSON.stringify(claim));
      const signInput = `${encodedHeader}.${encodedClaim}`;

      const sign = crypto.createSign('RSA-SHA256');
      sign.update(signInput);
      const signature = base64url(sign.sign(privateKey));

      const assertion = `${encodedHeader}.${encodedClaim}.${signature}`;

      fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          reject(new Error(`Google Auth error: ${JSON.stringify(data)}`));
        } else {
          resolve(data.access_token);
        }
      })
      .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

async function runDiagnostics() {
  try {
    const token = await getGoogleOAuth2Token(
      serviceAccount.client_email,
      serviceAccount.private_key,
      "https://www.googleapis.com/auth/calendar"
    );
    console.log("Successfully generated Google Calendar OAuth token!");

    // Fetch the latest booking to see what calendar event ID it has
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*, available_slots(date, time_slot)')
      .order('created_at', { ascending: false })
      .limit(1);

    if (bookingsError) throw bookingsError;

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found in database yet. Creating a test calendar event to check Meet generation...");
      await testEventCreation(token, "primary");
      await testEventCreation(token, "info@bena-tech.com");
      return;
    }

    const booking = bookings[0];
    console.log(`Latest booking: ${booking.first_name} ${booking.last_name} (${booking.email})`);
    console.log(`Google Event ID in DB: ${booking.google_event_id}`);

    if (booking.google_event_id) {
      // Query the event from Google Calendar
      const calendarId = "primary"; // Try primary first
      console.log(`Querying event ${booking.google_event_id} from primary calendar...`);
      let res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${booking.google_event_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let eventData = await res.json();
      
      if (!res.ok) {
        // Try with info@bena-tech.com as calendarId
        const altCalendarId = "info@bena-tech.com";
        console.log(`Failed on primary. Querying event ${booking.google_event_id} from ${altCalendarId} calendar...`);
        res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${altCalendarId}/events/${booking.google_event_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        eventData = await res.json();
      }

      if (res.ok) {
        console.log("Google Calendar Event Details:");
        console.log(`- Status: ${eventData.status}`);
        console.log(`- Summary: ${eventData.summary}`);
        console.log(`- Creator: ${eventData.creator?.email}`);
        console.log(`- Organiser: ${eventData.organizer?.email}`);
        console.log(`- Hangout Link (Meet): ${eventData.hangoutLink || "NONE"}`);
        if (eventData.conferenceData) {
          console.log(`- Conference Data: ${JSON.stringify(eventData.conferenceData)}`);
        } else {
          console.log(`- Conference Data: NONE`);
        }
      } else {
        console.error(`Could not retrieve event from Google Calendar: ${JSON.stringify(eventData)}`);
      }
    }

    // Now attempt to run a test event creation to see if Google Meet generation works
    console.log("\n--- Testing Direct Service Account Event Creation (No Impersonation) ---");
    await testEventCreation(token, "primary");
    await testEventCreation(token, "info@bena-tech.com");

    console.log("\n--- Testing Impersonated Service Account Event Creation (info@bena-tech.com) ---");
    try {
      const impersonatedToken = await getGoogleOAuth2Token(
        serviceAccount.client_email,
        serviceAccount.private_key,
        "https://www.googleapis.com/auth/calendar",
        "info@bena-tech.com"
      );
      console.log("✅ Successfully generated impersonated OAuth token for info@bena-tech.com!");
      await testEventCreation(impersonatedToken, "primary");
      await testEventCreation(impersonatedToken, "info@bena-tech.com");
    } catch (err) {
      console.error("❌ Failed to generate impersonated token:", err.message);
    }

  } catch (error) {
    console.error("Diagnostic error:", error);
  }
}

async function testEventCreation(token, calendarId) {
  console.log(`Testing event creation with Google Meet on calendar: ${calendarId}`);
  const testEvent = {
    summary: `Test Diagnostic Event`,
    description: `Checking Google Meet generation for service account`,
    start: {
      dateTime: new Date(Date.now() + 3600000).toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(Date.now() + 7200000).toISOString(),
      timeZone: "UTC",
    },
    conferenceData: {
      createRequest: {
        requestId: `test-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEvent),
    }
  );

  const data = await res.json();
  if (res.ok) {
    console.log(`✅ Success! Event created successfully.`);
    console.log(`   - Hangout Link (Meet): ${data.hangoutLink || "NONE"}`);
    if (!data.hangoutLink) {
      console.warn("   ⚠️ Warning: Event was created, but no Google Meet link was returned by Google.");
    }
    // Clean up test event
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${data.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  } else {
    console.error(`❌ Failed! Google Calendar API Error: ${JSON.stringify(data)}`);
  }
}

runDiagnostics();

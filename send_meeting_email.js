import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually from the current directory
const envPath = path.resolve('.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error("Error: Could not read .env file. Make sure you run this script from the project root directory.");
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Could not find VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sendMeetingEmail(clientEmail, firstName, lastName, date, timeSlot, interest, meetingType) {
  try {
    // Parse clientEmail for comma separated emails to support guests
    const emails = clientEmail.split(/[,;]+/).map(e => e.trim()).filter(Boolean);
    const primaryEmail = emails[0] || '';
    const guests = emails.slice(1).map(email => ({
      name: email.split('@')[0], // Default guest name to email prefix
      email: email
    }));

    console.log(`1. Checking if a slot already exists for ${date} at ${timeSlot}...`);
    let { data: slot, error: slotError } = await supabase
      .from('available_slots')
      .select('id')
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .maybeSingle();

    if (slotError) throw slotError;

    if (!slot) {
      console.log(`2. Slot does not exist. Creating a temporary slot for ${date} at ${timeSlot}...`);
      const { data: newSlot, error: createSlotError } = await supabase
        .from('available_slots')
        .insert({
          date: date,
          time_slot: timeSlot,
          is_booked: false
        })
        .select('id')
        .single();

      if (createSlotError) throw createSlotError;
      slot = newSlot;
    }

    console.log(`3. Inserting booking for ${firstName} ${lastName} (${primaryEmail})...`);
    if (guests.length > 0) {
      console.log(`   With guests: ${guests.map(g => g.email).join(', ')}`);
    }
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        slot_id: slot.id,
        first_name: firstName,
        last_name: lastName,
        email: primaryEmail,
        interest: interest || 'technical alignment',
        meeting_type: meetingType || 'online',
        guests: guests
      })
      .select('id')
      .single();

    if (bookingError) throw bookingError;

    console.log(`\n==================================================`);
    console.log(`🎉 Success! Booking inserted with ID: ${booking.id}`);
    console.log(`This will trigger the database webhook and send the`);
    console.log(`email with the banner to: ${clientEmail}`);
    console.log(`==================================================\n`);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Read arguments from command line
const args = process.argv.slice(2);
if (args.length < 5) {
  console.log(`Usage: node send_meeting_email.js <email> <firstName> <lastName> <YYYY-MM-DD> <timeSlot> [interest] [meetingType]`);
  console.log(`Example: node send_meeting_email.js client@example.com "John" "Doe" "2026-07-10" "10:00 AM" "Automation" "online"`);
  process.exit(0);
}

const [email, firstName, lastName, date, timeSlot, interest, meetingType] = args;
sendMeetingEmail(email, firstName, lastName, date, timeSlot, interest, meetingType);

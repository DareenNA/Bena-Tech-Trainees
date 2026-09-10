import fs from 'fs';
import path from 'path';

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

const resendApiKey = env['RESEND_API_KEY'];
const senderEmail = env['SENDER_EMAIL'] || 'onboarding@resend.dev';

// Read arguments
const args = process.argv.slice(2);
if (args.length < 4) {
  console.log("Usage: node send_trainee_email.js <traineeEmail> <traineeName> <subject> <messageBody>");
  console.log('\nExample:');
  console.log('  node send_trainee_email.js trainee@example.com "Ahmad" "Welcome to Bena Tech Training!" "We are thrilled to inform you that you have been accepted into the training program.\\n\\nPlease reply to this email to confirm."');
  process.exit(0);
}

const [traineeEmail, traineeName, subject, messageBody] = args;

if (!resendApiKey) {
  console.error("Error: RESEND_API_KEY is not set in your .env file.");
  console.error("Please add RESEND_API_KEY=your_key and SENDER_EMAIL=your_verified_domain_email to your .env file first.");
  process.exit(1);
}

// Convert line breaks in the message body to HTML paragraphs with RTL support for Arabic
const formattedBody = messageBody
  .split('\\n') // support literal '\n' passed from CLI
  .map(paragraph => paragraph.split('\n')) // support actual shell linebreaks
  .flat()
  .filter(p => p.trim() !== '')
  .map(p => {
    const isArabic = /[\u0600-\u06FF]/.test(p);
    const dir = isArabic ? 'rtl' : 'ltr';
    const align = isArabic ? 'right' : 'left';
    return `<p dir="${dir}" style="font-size: 15px; line-height: 1.8; margin: 0 0 16px 0; color: #374151; direction: ${dir}; text-align: ${align}; font-family: 'Segoe UI', Tahoma, -apple-system, BlinkMacSystemFont, Arial, sans-serif;">${p}</p>`;
  })
  .join('');

const htmlContent = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://bena-tech-trainees.pages.dev/email_banner.png" alt="Bena Tech" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto 24px auto; border-radius: 12px;" />
    <h2 style="color: #ea580c; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.02em;">Congratulations, ${traineeName}!</h2>
  </div>
  
  <div style="margin-bottom: 24px;">
    ${formattedBody}
  </div>

  <div style="text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0 0 8px 0;">This email was sent by <strong>Bena Tech</strong>.</p>
    <p style="margin: 0;">&copy; 2026 Bena Tech. All rights reserved.</p>
  </div>
</div>
`;

async function main() {
  try {
    console.log(`Sending email to ${traineeName} (${traineeEmail})...`);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Bena Tech <${senderEmail}>`,
        to: [traineeEmail],
        subject: subject,
        html: htmlContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || JSON.stringify(data));
    }

    console.log("🎉 Email sent successfully! Message ID:", data.id);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}

main();

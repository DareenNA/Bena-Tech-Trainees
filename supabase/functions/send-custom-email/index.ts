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
    // 1. Authenticate the caller using the user's authorization token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 2. Parse request payload
    const { to, name, subject, message, templateType, meetLink, meetButtonText } = await req.json();

    if (!to || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields (to, subject, message)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 3. Setup Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable in Supabase.");
    }

    const senderEmail = Deno.env.get("SENDER_EMAIL") || "onboarding@resend.dev";

    // Split paragraphs by newline/literal \n
    const paragraphs = message
      .split(/\r?\n|\\n/)
      .filter((p: string) => p.trim() !== "");

    const formattedBody = paragraphs
      .map((p: string) => `<p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: #374151;">${p}</p>`)
      .join("");

    // Setup Google Meet CTA button if link is provided
    let formattedMeetLink = meetLink ? meetLink.trim() : "";
    if (formattedMeetLink && !/^https?:\/\//i.test(formattedMeetLink)) {
      formattedMeetLink = `https://${formattedMeetLink}`;
    }

    let meetButtonHtml = "";
    if (formattedMeetLink) {
      const buttonLabel = (meetButtonText && meetButtonText.trim()) || "Join Google Meet";
      meetButtonHtml = `
      <div style="text-align: center; margin: 28px 0; padding: 24px; border: 1px dashed #ea580c; border-radius: 12px; background-color: #fffaf7;">
        <p style="margin: 0 0 14px 0; font-size: 14px; color: #4b5563; font-weight: 600;">Google Meet Session:</p>
        <a href="${formattedMeetLink}" target="_blank" style="background-color: #ea580c; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);">${buttonLabel}</a>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: #9ca3af;">(Click the button above to join the Google Meet call)</p>
      </div>
      `;
    }

    // Set heading text based on template selection
    let headingText = `Hello, ${name || 'Valued Client'}!`;
    if (templateType === "acceptance") {
      headingText = `Congratulations, ${name || 'Trainee'}!`;
    }

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://bena-tech.com/email_banner.png" alt="Bena Tech" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto 24px auto; border-radius: 12px;" />
        <h2 style="color: #ea580c; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.02em;">${headingText}</h2>
      </div>
      
      <div style="margin-bottom: 24px;">
        ${formattedBody}
      </div>

      ${meetButtonHtml}

      <div style="text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">This email was sent by <strong>Bena Tech</strong>.</p>
        <p style="margin: 0;">&copy; 2026 Bena Tech. All rights reserved.</p>
      </div>
    </div>
    `;

    // Support comma or semicolon separated emails
    const recipientList = to
      .split(/[,;]+/)
      .map((e: string) => e.trim())
      .filter(Boolean);

    console.log(`Sending custom email to: ${recipientList.join(", ")}`);

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Bena Tech <${senderEmail}>`,
        to: recipientList,
        subject: subject,
        html: htmlContent,
      }),
    });

    const emailData = await emailRes.json();
    if (!emailRes.ok) {
      throw new Error(emailData.message || JSON.stringify(emailData));
    }

    return new Response(JSON.stringify({ success: true, messageId: emailData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error sending custom email:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

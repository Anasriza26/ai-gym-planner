
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendVerificationEmail(
  email: string,
  otp: string,
) {
  if (!resend || !fromEmail) {
    throw new Error("Email service is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Verify Your AI Gym Planner Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #16a34a;">AI Gym Planner</h1>
        <p>Use the verification code below to verify your email address.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 0;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Verification email delivery failed:", error.message);
    throw new Error("Unable to send verification email.");
  }

  return data;
}

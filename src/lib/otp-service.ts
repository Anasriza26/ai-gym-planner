import { sql } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import {
  generateOtp,
  getOtpExpiry,
  hashOtp,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "@/lib/otp";

const GENERIC_MESSAGE =
  "If this email belongs to an eligible account, a verification code will be sent.";

export async function handleOtpRequest(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid request data." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, email, email_verified
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    const user = users[0];

    if (!user || user.email_verified === true) {
      return Response.json({
        success: true,
        message: GENERIC_MESSAGE,
      });
    }

    const otp = generateOtp();
    const codeHash = await hashOtp(otp);
    const expiresAt = getOtpExpiry();

    const savedCodes = await sql`
  INSERT INTO email_verification_codes (
    user_id,
    code_hash,
    otp_code,
    expires_at,
    attempts,
    last_sent_at,
    created_at
  )
  VALUES (
    ${user.id},
    ${codeHash},
    ${otp},
    ${expiresAt},
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    code_hash = EXCLUDED.code_hash,
    otp_code = EXCLUDED.otp_code,
    expires_at = EXCLUDED.expires_at,
    attempts = 0,
    last_sent_at = NOW(),
    created_at = NOW()
  WHERE email_verification_codes.last_sent_at
    <= NOW() - (${OTP_RESEND_COOLDOWN_SECONDS} * INTERVAL '1 second')
  RETURNING user_id
`;

    if (savedCodes.length === 0) {
      return Response.json({
        success: true,
        message: GENERIC_MESSAGE,
      });
    }

    try {
      await sendVerificationEmail(email, otp);
    } catch (error) {
      await sql`
        DELETE FROM email_verification_codes
        WHERE user_id = ${user.id}
          AND code_hash = ${codeHash}
      `;

      throw error;
    }

    return Response.json({
      success: true,
      message: GENERIC_MESSAGE,
    });
  } catch (error) {
    console.error("OTP request failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to process your request. Please try again later.",
      },
      { status: 500 },
    );
  }
}

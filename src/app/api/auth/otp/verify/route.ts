import { sql } from "@/lib/db";
import { verifyOtpHash } from "@/lib/otp";


export async function POST(request: Request) {
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

    const otp = typeof data.otp === "string" ? data.otp.trim() : "";

    if (
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{6}$/.test(otp)
    ) {
      return Response.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 },
      );
    }

    const records = await sql`
      SELECT
        u.id AS user_id,
        u.email_verified,
        c.code_hash,
        c.expires_at,
        c.attempts
      FROM users u
      INNER JOIN email_verification_codes c
        ON c.user_id = u.id
      WHERE u.email = ${email}
      LIMIT 1
    `;

    const record = records[0];

    if (!record || record.email_verified === true) {
      return Response.json(
        { success: false, message: "Invalid or expired verification code." },
        { status: 400 },
      );
    }

    if (
      Number(record.attempts) >= 5 ||
      new Date(record.expires_at).getTime() <= Date.now()
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired or attempt limit reached. Request a new code.",
        },
        { status: 400 },
      );
    }

    const matches = await verifyOtpHash(otp, String(record.code_hash));

    if (!matches) {
      const updated = await sql`
        UPDATE email_verification_codes
        SET attempts = attempts + 1
        WHERE user_id = ${record.user_id}
          AND code_hash = ${record.code_hash}
          AND expires_at > NOW()
          AND attempts < 5
        RETURNING attempts
      `;

      const attempts = updated[0] ? Number(updated[0].attempts) : 5;

      return Response.json(
        {
          success: false,
          message:
            attempts >= 5
              ? "Attempt limit reached. Request a new code."
              : "Invalid verification code.",
        },
        { status: 400 },
      );
    }

    const verifiedUsers = await sql`
      WITH consumed AS (
        DELETE FROM email_verification_codes
        WHERE user_id = ${record.user_id}
          AND code_hash = ${record.code_hash}
          AND expires_at > NOW()
          AND attempts < 5
        RETURNING user_id
      )
      UPDATE users
      SET email_verified = TRUE
      WHERE id IN (SELECT user_id FROM consumed)
        AND email_verified = FALSE
      RETURNING id
    `;

    if (verifiedUsers.length === 0) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired or already used. Request a new code if needed.",
        },
        { status: 400 },
      );
    }

    return Response.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Email verification failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to verify your email. Please try again later.",
      },
      { status: 500 },
    );
  }
}

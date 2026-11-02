import { hash } from "bcryptjs";
import { sql } from "@/lib/db";
import { handleOtpRequest } from "@/lib/otp-service";

type SignupBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let userId: number | null = null;

  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid request data." },
        { status: 400 },
      );
    }

    const data = body as SignupBody;

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const password = typeof data.password === "string" ? data.password : "";

    if (name.length < 2 || name.length > 100) {
      return Response.json(
        {
          success: false,
          message: "Name must be between 2 and 100 characters.",
        },
        { status: 400 },
      );
    }

    if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return Response.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters and at most 72 bytes.",
        },
        { status: 400 },
      );
    }

    const existingUsers = await sql`
      SELECT id
      FROM users
      WHERE LOWER(email) = ${email}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return Response.json(
        {
          success: false,
          message: "An account with this email already exists. Please log in.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);

    const newUsers = await sql`
      INSERT INTO users (
        name,
        email,
        password_hash,
        email_verified
      )
      VALUES (
        ${name},
        ${email},
        ${passwordHash},
        FALSE
      )
      RETURNING id, name, email
    `;

    const newUser = newUsers[0];

    if (!newUser) {
      throw new Error("User creation returned no record.");
    }

    userId = Number(newUser.id);

    const otpResponse = await handleOtpRequest(
      new Request("http://localhost/api/auth/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }),
    );

    let otpResult: { success?: boolean; message?: string };

    try {
      otpResult = await otpResponse.json();
    } catch {
      otpResult = { success: false };
    }

    if (!otpResponse.ok || otpResult.success !== true) {
      console.error("OTP request failed during signup.", {
        userId,
        status: otpResponse.status,
      });

      try {
        await sql`
          DELETE FROM users
          WHERE id = ${userId}
            AND email_verified = FALSE
        `;
      } catch (cleanupError) {
        console.error(
          "Failed to clean up unverified signup account:",
          cleanupError,
        );
      }

      userId = null;

      return Response.json(
        {
          success: false,
          message:
            "Your account could not be completed because the verification email could not be sent. Please try again later.",
        },
        { status: 502 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Account created. Check your email for the verification code.",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to create your account. Please try again later.",
      },
      { status: 500 },
    );
  }
}

import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`
      SELECT
        1 AS connected,
        NOW() AS database_time
    `;

    return Response.json({
      success: true,
      message: "Neon database connected successfully!",
      data: result[0],
    });
  } catch (error) {
    // Keep technical details in the server terminal only.
    console.error("Database connection test failed:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed. Check server configuration.",
      },
      { status: 500 },
    );
  }
}
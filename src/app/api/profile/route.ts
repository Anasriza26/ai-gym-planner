import { auth } from "@/auth";
import { sql } from "../../../lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        {
          success: false,
          message: "Please log in to access your fitness profiles.",
        },
        { status: 401 },
      );
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 401 },
      );
    }

    const userId = users[0].id;

    const profiles = await sql`
      SELECT
        id,
        name,
        age,
        height_cm,
        weight_kg,
        goal,
        experience,
        created_at
      FROM fitness_profiles
      WHERE user_id = ${userId}
      ORDER BY id DESC
      LIMIT 50
    `;

    return Response.json({
      success: true,
      message: "Fitness profiles fetched successfully!",
      data: profiles,
    });
  } catch (error) {
    console.error("Failed to fetch fitness profiles:", error);

    return Response.json(
      {
        success: false,
        message: "Could not fetch fitness profiles.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        {
          success: false,
          message: "Please log in to save your fitness profile.",
        },
        { status: 401 },
      );
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 401 },
      );
    }

    const userId = Number(users[0].id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error("Invalid user ID returned from database.");
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON data.",
        },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid profile data." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const age = typeof data.age === "number" ? data.age : NaN;
    const height = typeof data.height === "number" ? data.height : NaN;
    const weight = typeof data.weight === "number" ? data.weight : NaN;
    const goal = data.goal;
    const experience = data.experience;
    const allowedGoals = [
      "Muscle Gain",
      "Weight Loss",
      "General Fitness",
      "Improve Endurance",
    ];
    const allowedExperience = ["Beginner", "Intermediate", "Advanced"];

    if (
      !name ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120 ||
      !Number.isFinite(height) ||
      height < 80 ||
      height > 250 ||
      !Number.isFinite(weight) ||
      weight < 20 ||
      weight > 350 ||
      typeof goal !== "string" ||
      !allowedGoals.includes(goal) ||
      typeof experience !== "string" ||
      !allowedExperience.includes(experience)
    ) {
      return Response.json(
        { success: false, message: "Invalid profile data." },
        { status: 400 },
      );
    }

    const rows = await sql`
      INSERT INTO fitness_profiles (
        user_id,
        name,
        age,
        height_cm,
        weight_kg,
        goal,
        experience
      )
      VALUES (
        ${userId},
        ${name},
        ${age},
        ${height},
        ${weight},
        ${goal},
        ${experience}
      )
      RETURNING
        id,
        name,
        age,
        height_cm,
        weight_kg,
        goal,
        experience,
        created_at
    `;

    return Response.json(
      {
        success: true,
        message: "Fitness profile saved successfully!",
        data: rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Profile creation failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to save fitness profile.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    // 1. Verify the authenticated user
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        {
          success: false,
          message: "Please log in to update your fitness profile.",
        },
        { status: 401 },
      );
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 401 },
      );
    }

    const userId = users[0].id;

    // 2. Parse the request body

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON data.",
        },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid profile data." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const id = typeof data.id === "number" ? data.id : NaN;

    const name = typeof data.name === "string" ? data.name.trim() : "";

    const age = typeof data.age === "number" ? data.age : NaN;

    const height = typeof data.height === "number" ? data.height : NaN;

    const weight = typeof data.weight === "number" ? data.weight : NaN;

    const goal = data.goal;
    const experience = data.experience;

    // 3. Validate the profile ID
    if (!Number.isSafeInteger(id) || id <= 0) {
      return Response.json(
        { success: false, message: "Invalid profile ID." },
        { status: 400 },
      );
    }

    // 4. Validate profile fields
    const allowedGoals = [
      "Muscle Gain",
      "Weight Loss",
      "General Fitness",
      "Improve Endurance",
    ];

    const allowedExperience = ["Beginner", "Intermediate", "Advanced"];

    if (
      !name ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120 ||
      !Number.isFinite(height) ||
      height < 80 ||
      height > 250 ||
      !Number.isFinite(weight) ||
      weight < 20 ||
      weight > 350 ||
      typeof goal !== "string" ||
      !allowedGoals.includes(goal) ||
      typeof experience !== "string" ||
      !allowedExperience.includes(experience)
    ) {
      return Response.json(
        { success: false, message: "Invalid profile data." },
        { status: 400 },
      );
    }

    // 5. Update only a profile owned by this user
    const rows = await sql`
      UPDATE fitness_profiles
      SET
        name = ${name},
        age = ${age},
        height_cm = ${height},
        weight_kg = ${weight},
        goal = ${goal},
        experience = ${experience}
      WHERE id = ${id}
        AND user_id = ${userId}
      RETURNING
        id,
        name,
        age,
        height_cm,
        weight_kg,
        goal,
        experience,
        created_at
    `;

    // 6. Handle missing or unowned profiles
    if (rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Profile not found.",
        },
        { status: 404 },
      );
    }

    // 7. Return the updated profile
    return Response.json({
      success: true,
      message: "Profile updated successfully!",
      data: rows[0],
    });
  } catch (error) {
    console.error("Profile update failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update profile.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        {
          success: false,
          message: "Please log in to delete your fitness profile.",
        },
        { status: 401 },
      );
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 401 },
      );
    }

    const userId = users[0].id;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON data.",
        },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        {
          success: false,
          message: "Invalid request data.",
        },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const id = data.id;

    if (typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0) {
      return Response.json(
        {
          success: false,
          message: "Invalid profile ID.",
        },
        { status: 400 },
      );
    }

    const rows = await sql`
      DELETE FROM fitness_profiles
      WHERE id = ${id}
        AND user_id = ${userId}
      RETURNING id
    `;

    if (rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Profile not found.",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Profile deleted successfully!",
      data: rows[0],
    });
  } catch (error) {
    console.error("Profile deletion failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to delete profile.",
      },
      { status: 500 },
    );
  }
}

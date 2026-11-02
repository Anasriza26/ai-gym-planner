import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

const VALID_GOALS = [
  "Muscle Gain",
  "Weight Loss",
  "Strength",
  "General Fitness",
];

const VALID_EXPERIENCES = ["Beginner", "Intermediate", "Advanced"];

async function getAuthenticatedUserId(): Promise<number | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = Number(session.user.id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === null) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid workout plan data." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const { goal, experience, daysPerWeek, plan } = data;

    if (
      typeof goal !== "string" ||
      !VALID_GOALS.includes(goal) ||
      typeof experience !== "string" ||
      !VALID_EXPERIENCES.includes(experience) ||
      typeof daysPerWeek !== "number" ||
      !Number.isInteger(daysPerWeek) ||
      daysPerWeek < 1 ||
      daysPerWeek > 7 ||
      typeof plan !== "string" ||
      !plan.trim() ||
      plan.length > 30000
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid workout plan data." },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO workout_plans (
        user_id,
        goal,
        experience,
        days_per_week,
        plan
      )
      VALUES (
        ${userId},
        ${goal},
        ${experience},
        ${daysPerWeek},
        ${plan.trim()}
      )
      RETURNING
        id,
        goal,
        experience,
        days_per_week,
        created_at
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Workout plan saved successfully.",
        data: result[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Save workout plan error:", error);

    return NextResponse.json(
      { success: false, message: "Could not save workout plan." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === null) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const plans = await sql`
      SELECT
        id,
        goal,
        experience,
        days_per_week,
        plan,
        created_at
      FROM workout_plans
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get workout plans error:", error);

    return NextResponse.json(
      { success: false, message: "Could not load workout history." },
      { status: 500 },
    );
  }
}


import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { gemini } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { goal, experience, daysPerWeek } = body;

    const validGoals = [
      "Muscle Gain",
      "Weight Loss",
      "Strength",
      "General Fitness",
    ];

    const validExperiences = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    if (
      !validGoals.includes(goal) ||
      !validExperiences.includes(experience) ||
      !Number.isInteger(daysPerWeek) ||
      daysPerWeek < 1 ||
      daysPerWeek > 7
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid workout preferences." },
        { status: 400 },
      );
    }

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
Create a practical weekly workout plan.

Fitness goal: ${goal}
Experience level: ${experience}
Training days per week: ${daysPerWeek}

Include workout days, exercises, sets, repetitions,
rest days, and brief safety advice.

Return the plan in clear, readable Markdown.
`,
    });

    const plan = response.text;

    if (!plan?.trim()) {
      return NextResponse.json(
        { success: false, message: "AI returned an empty plan." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Workout plan API error:", error);

    return NextResponse.json(
      { success: false, message: "Could not generate workout plan." },
      { status: 500 },
    );
  }
}

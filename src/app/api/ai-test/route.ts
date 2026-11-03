import { NextResponse } from "next/server";
import { connection } from "next/server";
import { gemini } from "@/lib/gemini";

export async function GET() {
  await connection();

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: "Give me one short fitness tip for a beginner.",
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { success: false, message: "Gemini API test failed." },
      { status: 500 },
    );
  }
}

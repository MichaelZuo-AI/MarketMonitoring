import { NextRequest, NextResponse } from "next/server";
import { generateBriefing } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articles } = body;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: "Articles array is required" },
        { status: 400 }
      );
    }

    const briefing = await generateBriefing(articles);
    return NextResponse.json(briefing);
  } catch (error) {
    console.error("Briefing error:", error);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 }
    );
  }
}

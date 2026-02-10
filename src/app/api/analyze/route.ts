import { NextRequest, NextResponse } from "next/server";
import { analyzeArticle } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, snippet, source, category } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeArticle({
      title,
      snippet: snippet || "",
      source: source || "Unknown",
      category: category || "coupang",
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze article" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/feeds";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || "all";

  try {
    const articles = await fetchAllFeeds(category);
    return NextResponse.json({ articles, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", articles: [] },
      { status: 500 }
    );
  }
}

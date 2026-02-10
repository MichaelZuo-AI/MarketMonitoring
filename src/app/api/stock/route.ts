import { NextResponse } from "next/server";
import { getCPNGQuote } from "@/lib/stock";

export async function GET() {
  try {
    const quote = await getCPNGQuote();
    return NextResponse.json(quote);
  } catch (error) {
    console.error("Stock fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock quote" },
      { status: 500 }
    );
  }
}

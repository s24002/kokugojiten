// app/api/jisho/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q");

  if (!keyword) {
    return NextResponse.json({ error: "No keyword provided" }, { status: 400 });
  }

  const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
    keyword
  )}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Jisho API" },
        { status: 500 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

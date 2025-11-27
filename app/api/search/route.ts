import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) return NextResponse.json({ data: [] });

  const res = await fetch(
    `https://${
      process.env.MICROCMS_SERVICE_DOMAIN
    }.microcms.io/api/v1/words?filters=word[equals]${encodeURIComponent(q)}`,
    {
      headers: {
        "X-API-KEY": process.env.MICROCMS_API_KEY,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json({ data: data.contents });
}

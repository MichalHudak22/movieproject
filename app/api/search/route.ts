import { NextRequest, NextResponse } from "next/server";
import { searchMulti, searchTV, searchPerson } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const type = req.nextUrl.searchParams.get("type") || "multi";

  if (!query) return NextResponse.json({ results: [] });

  try {
    let data;

    if (type === "tv") {
      data = await searchTV(query);
    } else if (type === "person") {
      data = await searchPerson(query);
    } else {
      data = await searchMulti(query);
    }

    const filteredResults = data.results.filter((item: any) =>
      item.poster_path || item.profile_path
    );

    return NextResponse.json({ results: filteredResults });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}

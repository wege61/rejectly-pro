import { NextRequest, NextResponse } from "next/server";

interface University {
  name: string;
  country: string;
  alpha_two_code: string;
}

const GITHUB_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

let cachedData: University[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

async function getUniversities(): Promise<University[]> {
  if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedData;
  }

  const res = await fetch(GITHUB_URL);
  if (!res.ok) throw new Error("Failed to fetch university data");

  const data = await res.json();
  cachedData = data.map((item: any) => ({
    name: item.name,
    country: item.country,
    alpha_two_code: item.alpha_two_code,
  }));
  cacheTimestamp = Date.now();
  return cachedData!;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("name")?.toLowerCase();
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const universities = await getUniversities();

    const seen = new Set<string>();
    const results: { name: string; alpha_two_code: string }[] = [];

    for (const uni of universities) {
      if (results.length >= limit) break;
      if (uni.name.toLowerCase().includes(query) && !seen.has(uni.name)) {
        seen.add(uni.name);
        results.push({ name: uni.name, alpha_two_code: uni.alpha_two_code });
      }
    }

    return NextResponse.json(results);
  } catch (e) {
    console.error("University search error:", e);
    return NextResponse.json([], { status: 500 });
  }
}

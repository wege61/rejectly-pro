import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

// Get user location from IP
async function getLocationFromIP() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      city: data.city || "Istanbul",
      country: data.country_name || "Turkey",
      location: `${data.city}, ${data.country_name}`,
    };
  } catch (error) {
    console.error("Location detection error:", error);
    return {
      city: "Istanbul",
      country: "Turkey",
      location: "Istanbul, Turkey",
    };
  }
}

// Extract job title from CV
function extractJobTitle(cvText: string): string {
  const lowerCV = cvText.toLowerCase();

  if (lowerCV.includes("frontend") || lowerCV.includes("react")) {
    return "frontend developer";
  }
  if (lowerCV.includes("backend") || lowerCV.includes("node")) {
    return "backend developer";
  }
  if (lowerCV.includes("full stack") || lowerCV.includes("fullstack")) {
    return "full stack developer";
  }
  if (lowerCV.includes("data scientist") || lowerCV.includes("machine learning")) {
    return "data scientist";
  }
  if (lowerCV.includes("designer") || lowerCV.includes("ui/ux")) {
    return "designer";
  }

  return "software developer";
}

// Fetch jobs from Indeed RSS
async function fetchIndeedJobs(query: string, location: string, limit = 3) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(location);

    const rssUrl = `https://www.indeed.com/rss?q=${encodedQuery}&l=${encodedLocation}&sort=date&limit=50`;

    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    const result = await parseStringPromise(xmlText);
    const items = result.rss.channel[0].item || [];

    const jobs = items.slice(0, limit).map((item: any) => ({
      title: item.title[0],
      company: item.source?.[0] || "Company",
      location: item["indeed:location"]?.[0] || location,
      description: item.description[0]
        .replace(/<[^>]*>/g, "")
        .substring(0, 300),
      url: item.link[0],
      postedDate: item.pubDate?.[0] || new Date().toISOString(),
    }));

    return jobs;
  } catch (error) {
    console.error("Indeed RSS fetch error:", error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    if (!cvText || cvText.length < 50) {
      return NextResponse.json(
        { error: "CV text too short (minimum 50 characters)" },
        { status: 400 }
      );
    }

    // 1. Get location from IP
    const location = await getLocationFromIP();

    // 2. Extract job title from CV
    const jobTitle = extractJobTitle(cvText);

    // 3. Fetch jobs from Indeed RSS
    const jobs = await fetchIndeedJobs(jobTitle, location.location, 3);

    if (jobs.length === 0) {
      return NextResponse.json(
        { error: "No jobs found. Please try again later." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: location.location,
      detectedJobTitle: jobTitle,
      jobs,
    });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
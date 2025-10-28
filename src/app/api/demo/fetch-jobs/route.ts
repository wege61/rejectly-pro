import { parseStringPromise } from "xml2js";

export async function POST(request: Request) {
  try {
    const { cvText } = await request.json();

    if (!cvText || cvText.length < 50) {
      return Response.json({ error: "CV too short" }, { status: 400 });
    }

    // Location
    const locationRes = await fetch("https://ipapi.co/json/");
    const locationData = await locationRes.json();
    const location = `${locationData.city || "Istanbul"}, ${locationData.country_name || "Turkey"}`;

    // Job title
    const lower = cvText.toLowerCase();
    const jobTitle = lower.includes("frontend") ? "frontend developer" 
      : lower.includes("backend") ? "backend developer" 
      : "software developer";

    // Indeed RSS
    const rssUrl = `https://www.indeed.com/rss?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}&limit=50`;
    const rssRes = await fetch(rssUrl);
    const xml = await rssRes.text();
    
    const parsed = await parseStringPromise(xml, { strict: false });
    const items = Array.isArray(parsed?.rss?.channel?.item) 
      ? parsed.rss.channel.item 
      : [parsed?.rss?.channel?.item].filter(Boolean);

    const jobs = items.slice(0, 3).map((item: any) => ({
      title: item.title || "Job",
      company: item.source || "Company",
      location: item["indeed:location"] || location,
      description: String(item.description || "").replace(/<[^>]*>/g, "").substring(0, 300),
      url: item.link || "#",
    }));

    return Response.json({
      success: true,
      location,
      detectedJobTitle: jobTitle,
      jobs,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
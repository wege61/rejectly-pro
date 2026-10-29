import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import rateLimit from "@/lib/rate-limit";
import { sendContactMessage } from "@/lib/email";
import { CONTACT_TOPICS, CONTACT_TOPIC_IDS } from "@/lib/contact";

/*
 * The /contact form. Sends the message to our inbox with Reply set to the
 * sender. A hidden field catches bots (it's answered with a fake success), and
 * each address can send five messages an hour.
 */

const limiter = rateLimit({ name: "contact", interval: 60 * 60 * 1000 });

const schema = z.object({
  email: z.string().trim().email().max(200),
  topic: z.enum(CONTACT_TOPIC_IDS),
  message: z.string().trim().min(10).max(5000),
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Add an email we can reply to and a short message." }, { status: 400 });
  }
  const { email, topic, message, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    await limiter.check(5, ip);
  } catch {
    return NextResponse.json({ error: "That's a lot of messages in a short time. Try again in an hour, or email hello@rejectly.pro." }, { status: 429 });
  }

  try {
    await sendContactMessage(email, CONTACT_TOPICS[topic], message);
  } catch (error) {
    console.error("Contact message failed:", error);
    return NextResponse.json({ error: "We couldn't send that. Please email hello@rejectly.pro directly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

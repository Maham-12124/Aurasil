import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_EMAIL = "aurasil095@gmail.com";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  // Best-effort notifications — a slow/failed email shouldn't fail the
  // subscription itself, which already succeeded above.
  const results = await Promise.allSettled([
    sendMail({
      to: email,
      subject: "Thank you for subscribing to Aurasil",
      html: `<p>Thank you for subscribing to the Aurasil newsletter!</p><p>You'll be the first to know about new arrivals, sales, and considered pieces worth the wait.</p>`,
    }),
    sendMail({
      to: NOTIFY_EMAIL,
      subject: "New Newsletter Subscriber",
      html: `<p><strong>${email}</strong> has just subscribed to the Aurasil newsletter.</p>`,
    }),
  ]);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Newsletter email failed:", result.reason);
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

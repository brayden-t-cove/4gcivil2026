import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const installs = await prisma.trialInstall.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(installs);
}

export async function POST(request: Request) {
  const body = await request.json();

  const required = ["techName", "pandoAccountNumber", "customerLunaEmail"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const install = await prisma.trialInstall.create({
    data: {
      techName: body.techName,
      pandoAccountNumber: body.pandoAccountNumber,
      customerLunaEmail: body.customerLunaEmail,
      setupSuccessful: !!body.setupSuccessful,
      needsPublishing: !!body.needsPublishing,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(install, { status: 201 });
}

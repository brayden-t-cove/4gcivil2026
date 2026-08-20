import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tickets = await prisma.failureTicket.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const body = await request.json();

  const required = ["techName", "category", "symptoms"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const ticket = await prisma.failureTicket.create({
    data: {
      techName: body.techName,
      category: body.category,
      customerName: body.customerName || null,
      originalCameraSerial: body.originalCameraSerial || null,
      replacementCameraSerial: body.replacementCameraSerial || null,
      symptoms: body.symptoms,
      troubleshootingSteps: body.troubleshootingSteps || null,
      resolvedOnSite: !!body.resolvedOnSite,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}

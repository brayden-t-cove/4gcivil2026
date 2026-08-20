import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Prisma.TrialInstallUpdateInput = {};

  if ("needsPublishing" in body) {
    if (typeof body.needsPublishing !== "boolean") {
      return NextResponse.json(
        { error: "needsPublishing must be a boolean" },
        { status: 400 }
      );
    }
    data.needsPublishing = body.needsPublishing;
  }

  if ("migratedAt" in body) {
    if (body.migratedAt !== null) {
      return NextResponse.json(
        { error: "migratedAt can only be cleared (set to null) via this endpoint" },
        { status: 400 }
      );
    }
    data.migratedAt = null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const install = await prisma.trialInstall.update({ where: { id }, data });
    return NextResponse.json(install);
  } catch {
    return NextResponse.json({ error: "Install record not found" }, { status: 404 });
  }
}

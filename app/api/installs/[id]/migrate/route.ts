import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const install = await prisma.trialInstall.update({
      where: { id },
      data: { migratedAt: new Date() },
    });
    return NextResponse.json(install);
  } catch {
    return NextResponse.json({ error: "Install record not found" }, { status: 404 });
  }
}

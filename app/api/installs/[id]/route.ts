import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (typeof body.needsPublishing !== "boolean") {
    return NextResponse.json(
      { error: "needsPublishing must be a boolean" },
      { status: 400 }
    );
  }

  try {
    const install = await prisma.trialInstall.update({
      where: { id },
      data: { needsPublishing: body.needsPublishing },
    });
    return NextResponse.json(install);
  } catch {
    return NextResponse.json({ error: "Install record not found" }, { status: 404 });
  }
}

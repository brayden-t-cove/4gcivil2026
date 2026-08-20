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

  const required = ["techName", "customerName", "batteryChargeOnArrival", "siteTestResult", "cameraSerial", "cameraMountMethod", "panelMountMethod"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const install = await prisma.trialInstall.create({
    data: {
      techName: body.techName,
      customerName: body.customerName,
      customerAddress: body.customerAddress || null,
      lunaAccountCreated: !!body.lunaAccountCreated,
      pandoAccountConfirmed: !!body.pandoAccountConfirmed,
      batteryChargeOnArrival: body.batteryChargeOnArrival,
      batteryNotes: body.batteryNotes || null,
      siteTestResult: body.siteTestResult,
      siteTestLocationsTried: Number(body.siteTestLocationsTried) || 1,
      liveFeedQualityNotes: body.liveFeedQualityNotes || null,
      cameraSerial: body.cameraSerial,
      cameraMountMethod: body.cameraMountMethod,
      panelMountMethod: body.panelMountMethod,
      isFirstCameraOnAccount: !!body.isFirstCameraOnAccount,
      subscriptionPlan: body.subscriptionPlan || null,
      billedOnLunaCard: !!body.billedOnLunaCard,
      walkTestEventDetectionOk: !!body.walkTestEventDetectionOk,
      postMountAngleVerified: !!body.postMountAngleVerified,
      liveViewPostMountOk: !!body.liveViewPostMountOk,
      eventPlaybackPostMountOk: !!body.eventPlaybackPostMountOk,
      customerUnderstandsSystem: !!body.customerUnderstandsSystem,
      billingExplainedToCustomer: !!body.billingExplainedToCustomer,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(install, { status: 201 });
}

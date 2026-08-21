import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { FAILURE_CATEGORIES, labelFor } from "@/lib/options";

function formatDate(date: Date | null) {
  return date ? date.toISOString() : "";
}

export async function GET() {
  const [installs, tickets] = await Promise.all([
    prisma.trialInstall.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.failureTicket.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const installRows = installs.map((i) => ({
    "Date": formatDate(i.createdAt),
    "Tech": i.techName,
    "Pando Account #": i.pandoAccountNumber,
    "Customer's Luna Email": i.customerLunaEmail,
    "Setup Successful": i.setupSuccessful ? "Yes" : "No",
    "Needs Publishing": i.needsPublishing ? "Yes" : "No",
    "Published At": formatDate(i.publishedAt),
    "Migrated to Alder At": formatDate(i.migratedAt),
    "Notes": i.notes ?? "",
  }));

  const ticketRows = tickets.map((t) => ({
    "Date": formatDate(t.createdAt),
    "Tech": t.techName,
    "Pando ID / PO #": t.pandoIdOrPoNumber,
    "Category": labelFor(FAILURE_CATEGORIES, t.category),
    "Customer": t.customerName ?? "",
    "Original Camera Serial": t.originalCameraSerial ?? "",
    "Replacement Camera Serial": t.replacementCameraSerial ?? "",
    "Symptoms": t.symptoms,
    "Troubleshooting Steps": t.troubleshootingSteps ?? "",
    "Resolved On Site": t.resolvedOnSite ? "Yes" : "No",
    "Notes": t.notes ?? "",
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(installRows),
    "Trial Installs"
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(ticketRows),
    "Failure Tickets"
  );

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const filename = `luna-4g-trial-export-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

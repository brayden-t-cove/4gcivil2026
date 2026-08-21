import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FAILURE_CATEGORIES, labelFor } from "@/lib/options";
import RefreshButton from "@/components/RefreshButton";

export const dynamic = "force-dynamic";

export default async function TicketRecordsPage() {
  const tickets = await prisma.failureTicket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Failure / DOA Tickets
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {tickets.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No tickets logged yet.</p>
        )}
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {labelFor(FAILURE_CATEGORIES, ticket.category)}
              </h2>
              <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {ticket.customerName || "No customer (pre-install / site test)"}
            </p>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-zinc-500 dark:text-zinc-400">Tech</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">{ticket.techName}</dd>

              <dt className="text-zinc-500 dark:text-zinc-400">Pando ID / PO #</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">
                {ticket.pandoIdOrPoNumber || "—"}
              </dd>

              {ticket.originalCameraSerial && (
                <>
                  <dt className="text-zinc-500 dark:text-zinc-400">Original serial</dt>
                  <dd className="text-zinc-900 dark:text-zinc-100">
                    {ticket.originalCameraSerial}
                  </dd>
                </>
              )}
              {ticket.replacementCameraSerial && (
                <>
                  <dt className="text-zinc-500 dark:text-zinc-400">Replacement serial</dt>
                  <dd className="text-zinc-900 dark:text-zinc-100">
                    {ticket.replacementCameraSerial}
                  </dd>
                </>
              )}

              <dt className="text-zinc-500 dark:text-zinc-400">Resolved on-site</dt>
              <dd
                className={
                  ticket.resolvedOnSite
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "font-medium text-red-600 dark:text-red-400"
                }
              >
                {ticket.resolvedOnSite ? "Yes" : "No"}
              </dd>
            </dl>

            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">Symptoms: </span>
              {ticket.symptoms}
            </p>
            {ticket.troubleshootingSteps && (
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Steps tried: </span>
                {ticket.troubleshootingSteps}
              </p>
            )}
            {ticket.notes && (
              <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {ticket.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

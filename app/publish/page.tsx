import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublishButton from "@/components/PublishButton";
import RefreshButton from "@/components/RefreshButton";

export const dynamic = "force-dynamic";

export default async function PublishQueuePage() {
  const pending = await prisma.trialInstall.findMany({
    where: { needsPublishing: true, publishedAt: null },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Publish Queue
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {pending.length} account{pending.length === 1 ? "" : "s"} waiting to be published
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {pending.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Nothing waiting — every flagged account has been published.
          </p>
        )}
        {pending.map((install) => (
          <div
            key={install.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                {install.customerLunaEmail}
              </div>
              <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                <dt>Pando account #</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {install.pandoAccountNumber}
                </dd>
                <dt>Tech</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">{install.techName}</dd>
                <dt>Logged</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {new Date(install.createdAt).toLocaleString()}
                </dd>
              </dl>
              {install.notes && (
                <p className="mt-2 rounded-lg bg-zinc-50 p-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {install.notes}
                </p>
              )}
            </div>
            <PublishButton id={install.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

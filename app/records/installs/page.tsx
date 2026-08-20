import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublishingControl from "@/components/PublishingControl";
import MigrationControl from "@/components/MigrationControl";

export const dynamic = "force-dynamic";

export default async function InstallRecordsPage() {
  const installs = await prisma.trialInstall.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Trial Install Records
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {installs.length} record{installs.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {installs.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No install records yet.</p>
        )}
        {installs.map((install) => (
          <div
            key={install.id}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Pando #{install.pandoAccountNumber}
              </h2>
              <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(install.createdAt).toLocaleString()}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-zinc-500 dark:text-zinc-400">Tech</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">{install.techName}</dd>

              <dt className="text-zinc-500 dark:text-zinc-400">Pando account #</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">{install.pandoAccountNumber}</dd>

              <dt className="text-zinc-500 dark:text-zinc-400">Customer&apos;s email on Luna</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">{install.customerLunaEmail}</dd>

              <dt className="text-zinc-500 dark:text-zinc-400">Setup successful</dt>
              <dd
                className={
                  install.setupSuccessful
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "font-medium text-red-600 dark:text-red-400"
                }
              >
                {install.setupSuccessful ? "Yes" : "No"}
              </dd>
            </dl>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-900">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Publishing</span>
              <PublishingControl
                id={install.id}
                needsPublishing={install.needsPublishing}
                publishedAt={install.publishedAt ? install.publishedAt.toISOString() : null}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-900">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Migrated to Alder</span>
              <MigrationControl
                id={install.id}
                migratedAt={install.migratedAt ? install.migratedAt.toISOString() : null}
              />
            </div>

            {install.notes && (
              <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {install.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

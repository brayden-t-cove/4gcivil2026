"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MigrationControl({
  id,
  migratedAt,
}: {
  id: string;
  migratedAt: string | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function markMigrated() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/installs/${id}/migrate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to mark as migrated");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  async function unmarkMigrated() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/installs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ migratedAt: null }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const buttonClass =
    "rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900";
  const primaryButtonClass =
    "rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {!migratedAt ? (
          <>
            <span className="font-medium text-red-600 dark:text-red-400">Not migrated</span>
            <button
              type="button"
              disabled={submitting}
              onClick={markMigrated}
              className={primaryButtonClass}
            >
              Mark migrated
            </button>
          </>
        ) : (
          <>
            <span>Migrated</span>
            <button
              type="button"
              disabled={submitting}
              onClick={unmarkMigrated}
              className={buttonClass}
            >
              Un-migrate
            </button>
          </>
        )}
      </div>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishingControl({
  id,
  needsPublishing,
  publishedAt,
}: {
  id: string;
  needsPublishing: boolean;
  publishedAt: string | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setNeedsPublishing(value: boolean) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/installs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needsPublishing: value }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  async function markPublished() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/installs/${id}/publish`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to mark as published");
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
        {!needsPublishing && (
          <>
            <span className="text-zinc-500 dark:text-zinc-400">N/A</span>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setNeedsPublishing(true)}
              className={buttonClass}
            >
              Flag for publishing
            </button>
          </>
        )}
        {needsPublishing && !publishedAt && (
          <>
            <span className="font-medium text-red-600 dark:text-red-400">Pending</span>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setNeedsPublishing(false)}
              className={buttonClass}
            >
              Un-flag
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={markPublished}
              className={primaryButtonClass}
            >
              Mark published
            </button>
          </>
        )}
        {needsPublishing && publishedAt && <span>Published</span>}
      </div>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}

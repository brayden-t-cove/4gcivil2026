"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  function handleClick() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
    >
      {refreshing ? "Refreshing..." : "Refresh"}
    </button>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Luna 4G PTZ — Trial Batch
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Control batch — Alder Techs
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          href="/install"
          className="flex flex-col gap-1 rounded-xl bg-zinc-900 px-5 py-5 text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          <span className="text-lg font-semibold">New Trial Install Record</span>
          <span className="text-sm opacity-80">
            Document a customer 1-year trial install
          </span>
        </Link>

        <Link
          href="/ticket"
          className="flex flex-col gap-1 rounded-xl border-2 border-red-600 px-5 py-5 text-red-700 shadow-sm transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          <span className="text-lg font-semibold">New Failure / DOA Ticket</span>
          <span className="text-sm opacity-80">
            Log a DOA unit, coverage failure, or setup issue
          </span>
        </Link>

        <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />

        <Link
          href="/records/installs"
          className="rounded-xl border border-zinc-300 px-5 py-4 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          View install records
        </Link>
        <Link
          href="/records/tickets"
          className="rounded-xl border border-zinc-300 px-5 py-4 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          View failure / DOA tickets
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import InstallForm from "./InstallForm";

export default function InstallPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        New Trial Install Record
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Document a completed (or in-progress) Luna 4G PTZ install for the 1-year trial batch.
      </p>
      <div className="mt-6">
        <InstallForm />
      </div>
    </div>
  );
}

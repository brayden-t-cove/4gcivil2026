import Link from "next/link";
import TicketForm from "./TicketForm";

export default function TicketPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        New Failure / DOA Ticket
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Log a DOA unit, coverage failure, or any setup issue from Section 8 of the SOP.
      </p>
      <div className="mt-6">
        <TicketForm />
      </div>
    </div>
  );
}

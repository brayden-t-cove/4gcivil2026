import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BATTERY_OPTIONS,
  FAILURE_CATEGORIES,
  MOUNT_METHODS,
  SITE_TEST_RESULTS,
  SUBSCRIPTION_PLANS,
  labelFor,
} from "@/lib/options";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function StatCard({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div
        className={
          alert && value > 0
            ? "text-2xl font-bold text-red-600 dark:text-red-400"
            : "text-2xl font-bold text-zinc-900 dark:text-zinc-50"
        }
      >
        {value}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
    </div>
  );
}

const selectClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

export default async function ManagerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v || "";
  };

  const installTech = get("installTech");
  const installResult = get("installResult");
  const ticketTech = get("ticketTech");
  const ticketCategory = get("ticketCategory");
  const ticketResolved = get("ticketResolved");

  const [allInstalls, allTickets] = await Promise.all([
    prisma.trialInstall.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.failureTicket.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const installWhere: Prisma.TrialInstallWhereInput = {};
  if (installTech) installWhere.techName = { contains: installTech };
  if (installResult) installWhere.siteTestResult = installResult;

  const ticketWhere: Prisma.FailureTicketWhereInput = {};
  if (ticketTech) ticketWhere.techName = { contains: ticketTech };
  if (ticketCategory) ticketWhere.category = ticketCategory;
  if (ticketResolved) ticketWhere.resolvedOnSite = ticketResolved === "yes";

  const [installs, tickets] = await Promise.all([
    prisma.trialInstall.findMany({ where: installWhere, orderBy: { createdAt: "desc" } }),
    prisma.failureTicket.findMany({ where: ticketWhere, orderBy: { createdAt: "desc" } }),
  ]);

  const coverageFailures = allInstalls.filter((i) => i.siteTestResult === "fail_coverage").length;
  const signOffComplete = allInstalls.filter(
    (i) => i.customerUnderstandsSystem && i.billingExplainedToCustomer
  ).length;
  const unresolvedTickets = allTickets.filter((t) => !t.resolvedOnSite).length;
  const doaSwaps = allTickets.filter((t) => t.category === "doa_wont_come_online").length;
  const billingAnomalies = allTickets.filter((t) => t.category === "billing_payment_prompt").length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Manager Dashboard
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Trial batch overview — all install records and failure/DOA tickets logged by techs.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total installs" value={allInstalls.length} />
        <StatCard label="Sign-off complete" value={signOffComplete} />
        <StatCard label="Coverage failures" value={coverageFailures} alert />
        <StatCard label="Total tickets" value={allTickets.length} />
        <StatCard label="Unresolved tickets" value={unresolvedTickets} alert />
        <StatCard label="DOA swaps" value={doaSwaps} />
        <StatCard label="Billing anomalies" value={billingAnomalies} alert />
      </div>

      {/* Installs */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Trial Install Records
        </h2>
        <form className="mt-3 flex flex-wrap items-end gap-3" method="get">
          <input type="hidden" name="ticketTech" value={ticketTech} />
          <input type="hidden" name="ticketCategory" value={ticketCategory} />
          <input type="hidden" name="ticketResolved" value={ticketResolved} />
          <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            Tech
            <input
              type="text"
              name="installTech"
              defaultValue={installTech}
              placeholder="Filter by tech..."
              className={selectClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            Site test result
            <select name="installResult" defaultValue={installResult} className={selectClass}>
              <option value="">All</option>
              {SITE_TEST_RESULTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Apply
          </button>
          {(installTech || installResult) && (
            <a
              href={`/manager?ticketTech=${ticketTech}&ticketCategory=${ticketCategory}&ticketResolved=${ticketResolved}`}
              className="text-sm text-zinc-500 hover:underline"
            >
              Clear
            </a>
          )}
        </form>

        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Tech</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Serial</th>
                <th className="px-3 py-2">Site test</th>
                <th className="px-3 py-2">Mount (cam / panel)</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Battery</th>
                <th className="px-3 py-2">Sign-off</th>
              </tr>
            </thead>
            <tbody>
              {installs.map((i) => (
                <tr
                  key={i.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-500 dark:text-zinc-400">
                    {new Date(i.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{i.techName}</td>
                  <td className="px-3 py-2">{i.customerName}</td>
                  <td className="px-3 py-2">{i.cameraSerial}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        i.siteTestResult === "fail_coverage"
                          ? "font-medium text-red-600 dark:text-red-400"
                          : ""
                      }
                    >
                      {labelFor(SITE_TEST_RESULTS, i.siteTestResult)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {labelFor(MOUNT_METHODS, i.cameraMountMethod)} /{" "}
                    {labelFor(MOUNT_METHODS, i.panelMountMethod)}
                  </td>
                  <td className="px-3 py-2">{labelFor(SUBSCRIPTION_PLANS, i.subscriptionPlan)}</td>
                  <td className="px-3 py-2">{labelFor(BATTERY_OPTIONS, i.batteryChargeOnArrival)}</td>
                  <td className="px-3 py-2">
                    {i.customerUnderstandsSystem && i.billingExplainedToCustomer ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
              {installs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-zinc-500 dark:text-zinc-400">
                    No matching install records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tickets */}
      <section className="mt-10 pb-16">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Failure / DOA Tickets
        </h2>
        <form className="mt-3 flex flex-wrap items-end gap-3" method="get">
          <input type="hidden" name="installTech" value={installTech} />
          <input type="hidden" name="installResult" value={installResult} />
          <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            Tech
            <input
              type="text"
              name="ticketTech"
              defaultValue={ticketTech}
              placeholder="Filter by tech..."
              className={selectClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            Category
            <select name="ticketCategory" defaultValue={ticketCategory} className={selectClass}>
              <option value="">All</option>
              {FAILURE_CATEGORIES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            Resolved
            <select name="ticketResolved" defaultValue={ticketResolved} className={selectClass}>
              <option value="">All</option>
              <option value="yes">Resolved on-site</option>
              <option value="no">Unresolved</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Apply
          </button>
          {(ticketTech || ticketCategory || ticketResolved) && (
            <a
              href={`/manager?installTech=${installTech}&installResult=${installResult}`}
              className="text-sm text-zinc-500 hover:underline"
            >
              Clear
            </a>
          )}
        </form>

        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Tech</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Original / Replacement</th>
                <th className="px-3 py-2">Symptoms</th>
                <th className="px-3 py-2">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-500 dark:text-zinc-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{t.techName}</td>
                  <td className="px-3 py-2">{labelFor(FAILURE_CATEGORIES, t.category)}</td>
                  <td className="px-3 py-2">{t.customerName || "—"}</td>
                  <td className="px-3 py-2">
                    {t.originalCameraSerial || "—"} / {t.replacementCameraSerial || "—"}
                  </td>
                  <td className="max-w-xs px-3 py-2 truncate" title={t.symptoms}>
                    {t.symptoms}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        t.resolvedOnSite
                          ? ""
                          : "font-medium text-red-600 dark:text-red-400"
                      }
                    >
                      {t.resolvedOnSite ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-zinc-500 dark:text-zinc-400">
                    No matching tickets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

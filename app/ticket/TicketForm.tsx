"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Field,
  Select,
  SubmitButton,
  TextArea,
  TextInput,
  Toggle,
  SectionTitle,
} from "@/components/form";
import { FAILURE_CATEGORIES } from "@/lib/options";

const initialState = {
  techName: "",
  category: "",
  customerName: "",
  originalCameraSerial: "",
  replacementCameraSerial: "",
  symptoms: "",
  troubleshootingSteps: "",
  resolvedOnSite: false,
  notes: "",
};

const SWAP_CATEGORIES = new Set(["doa_wont_come_online"]);

export default function TicketForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const showSwapFields = SWAP_CATEGORIES.has(form.category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save ticket");
      }
      router.push("/records/tickets?created=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-16">
      <SectionTitle>Tech</SectionTitle>
      <Field label="Tech name or employee badge #" required>
        <TextInput
          required
          value={form.techName}
          onChange={(e) => set("techName", e.target.value)}
        />
      </Field>

      <SectionTitle>Issue</SectionTitle>
      <Field label="Category" required>
        <Select
          required
          placeholder="Select..."
          options={FAILURE_CATEGORIES}
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />
      </Field>
      <Field label="Customer name (leave blank if this happened during site test, pre-customer)">
        <TextInput
          value={form.customerName}
          onChange={(e) => set("customerName", e.target.value)}
        />
      </Field>

      {showSwapFields && (
        <>
          <SectionTitle>Camera swap</SectionTitle>
          <Field label="Original camera serial">
            <TextInput
              value={form.originalCameraSerial}
              onChange={(e) => set("originalCameraSerial", e.target.value)}
            />
          </Field>
          <Field label="Replacement camera serial">
            <TextInput
              value={form.replacementCameraSerial}
              onChange={(e) => set("replacementCameraSerial", e.target.value)}
            />
          </Field>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Reminder: do not swap the SIM between units.
          </p>
        </>
      )}

      <SectionTitle>Details</SectionTitle>
      <Field label="Symptoms observed" required>
        <TextArea
          required
          rows={4}
          value={form.symptoms}
          onChange={(e) => set("symptoms", e.target.value)}
        />
      </Field>
      <Field label="Troubleshooting steps already tried">
        <TextArea
          value={form.troubleshootingSteps}
          onChange={(e) => set("troubleshootingSteps", e.target.value)}
        />
      </Field>
      <Toggle
        label="Resolved on-site"
        checked={form.resolvedOnSite}
        onChange={(v) => set("resolvedOnSite", v)}
      />
      <Field label="Additional notes">
        <TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <SubmitButton disabled={submitting}>
        {submitting ? "Saving..." : "Save ticket"}
      </SubmitButton>
    </form>
  );
}

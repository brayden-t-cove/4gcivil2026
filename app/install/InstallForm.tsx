"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, SubmitButton, TextArea, TextInput, Toggle } from "@/components/form";

const initialState = {
  techName: "",
  pandoAccountNumber: "",
  customerLunaEmail: "",
  setupSuccessful: true,
  needsPublishing: false,
  notes: "",
};

export default function InstallForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/installs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save install record");
      }
      router.push("/?saved=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-16">
      <Field label="Tech name or employee ID" required>
        <TextInput
          required
          value={form.techName}
          onChange={(e) => set("techName", e.target.value)}
          placeholder="e.g. J. Alvarez or badge #4471"
        />
      </Field>

      <Field label="Pando account number" required>
        <TextInput
          required
          value={form.pandoAccountNumber}
          onChange={(e) => set("pandoAccountNumber", e.target.value)}
        />
      </Field>

      <Field label="Customer's email on Luna" required>
        <TextInput
          required
          type="email"
          value={form.customerLunaEmail}
          onChange={(e) => set("customerLunaEmail", e.target.value)}
        />
      </Field>

      <Toggle
        label="Setup and install successful"
        checked={form.setupSuccessful}
        onChange={(v) => set("setupSuccessful", v)}
      />

      <Toggle
        label="Account needs publishing"
        checked={form.needsPublishing}
        onChange={(v) => set("needsPublishing", v)}
      />

      <Field label="Other notes worth mentioning (optional)">
        <TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={4} />
      </Field>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <SubmitButton disabled={submitting}>
        {submitting ? "Saving..." : "Save install record"}
      </SubmitButton>
    </form>
  );
}

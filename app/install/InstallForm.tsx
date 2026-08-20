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
import {
  BATTERY_OPTIONS,
  MOUNT_METHODS,
  SITE_TEST_RESULTS,
  SUBSCRIPTION_PLANS,
} from "@/lib/options";

const initialState = {
  techName: "",
  customerName: "",
  customerAddress: "",
  lunaAccountCreated: false,
  pandoAccountConfirmed: false,
  batteryChargeOnArrival: "",
  batteryNotes: "",
  siteTestResult: "",
  siteTestLocationsTried: "1",
  liveFeedQualityNotes: "",
  cameraSerial: "",
  cameraMountMethod: "",
  panelMountMethod: "",
  isFirstCameraOnAccount: false,
  subscriptionPlan: "",
  billedOnLunaCard: false,
  walkTestEventDetectionOk: false,
  postMountAngleVerified: false,
  liveViewPostMountOk: false,
  eventPlaybackPostMountOk: false,
  customerUnderstandsSystem: false,
  billingExplainedToCustomer: false,
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

  const siteTestFailed = form.siteTestResult === "fail_coverage";

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
      router.push("/records/installs?created=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-16">
      {siteTestFailed && (
        <div className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Site test failed at every location tried — this should be logged as a{" "}
          <span className="font-semibold">coverage failure</span>. Consider also filing a{" "}
          <a href="/ticket" className="underline">
            Failure / DOA ticket
          </a>{" "}
          instead of continuing this install record.
        </div>
      )}

      <SectionTitle>Tech</SectionTitle>
      <Field label="Tech name or employee badge #" required>
        <TextInput
          required
          value={form.techName}
          onChange={(e) => set("techName", e.target.value)}
          placeholder="e.g. J. Alvarez or badge #4471"
        />
      </Field>

      <SectionTitle>Customer</SectionTitle>
      <Field label="Customer name" required>
        <TextInput
          required
          value={form.customerName}
          onChange={(e) => set("customerName", e.target.value)}
        />
      </Field>
      <Field label="Customer address">
        <TextInput
          value={form.customerAddress}
          onChange={(e) => set("customerAddress", e.target.value)}
        />
      </Field>

      <SectionTitle>1. Pre-install checklist</SectionTitle>
      <Toggle
        label="Luna account created for customer"
        checked={form.lunaAccountCreated}
        onChange={(v) => set("lunaAccountCreated", v)}
      />
      <Toggle
        label="Pando equipment account confirmed"
        checked={form.pandoAccountConfirmed}
        onChange={(v) => set("pandoAccountConfirmed", v)}
      />
      <Field label="Battery charge on arrival" required>
        <Select
          required
          placeholder="Select..."
          options={BATTERY_OPTIONS}
          value={form.batteryChargeOnArrival}
          onChange={(e) => set("batteryChargeOnArrival", e.target.value)}
        />
      </Field>
      <Field label="Battery notes (optional)">
        <TextArea
          value={form.batteryNotes}
          onChange={(e) => set("batteryNotes", e.target.value)}
        />
      </Field>

      <SectionTitle>2. Site test (dedicated test camera)</SectionTitle>
      <Field label="Result" required>
        <Select
          required
          placeholder="Select..."
          options={SITE_TEST_RESULTS}
          value={form.siteTestResult}
          onChange={(e) => set("siteTestResult", e.target.value)}
        />
      </Field>
      <Field label="Number of locations tried">
        <TextInput
          type="number"
          min={1}
          value={form.siteTestLocationsTried}
          onChange={(e) => set("siteTestLocationsTried", e.target.value)}
        />
      </Field>
      <Field label="Live feed quality / stability notes (judgment call)">
        <TextArea
          value={form.liveFeedQualityNotes}
          onChange={(e) => set("liveFeedQualityNotes", e.target.value)}
          placeholder="No formal signal threshold this batch — describe what you saw"
        />
      </Field>

      <SectionTitle>3, 5, 6. Camera & mounting</SectionTitle>
      <Field label="Installed camera serial number" required>
        <TextInput
          required
          value={form.cameraSerial}
          onChange={(e) => set("cameraSerial", e.target.value)}
        />
      </Field>
      <Field label="Camera mount method" required>
        <Select
          required
          placeholder="Select..."
          options={MOUNT_METHODS}
          value={form.cameraMountMethod}
          onChange={(e) => set("cameraMountMethod", e.target.value)}
        />
      </Field>
      <Field label="Solar panel mount method" required>
        <Select
          required
          placeholder="Select..."
          options={MOUNT_METHODS}
          value={form.panelMountMethod}
          onChange={(e) => set("panelMountMethod", e.target.value)}
        />
      </Field>

      <SectionTitle>4. App pairing</SectionTitle>
      <Toggle
        label="First camera paired to this account"
        checked={form.isFirstCameraOnAccount}
        onChange={(v) => set("isFirstCameraOnAccount", v)}
      />
      <Field label="Subscription plan selected">
        <Select
          placeholder="N/A / not prompted"
          options={SUBSCRIPTION_PLANS}
          value={form.subscriptionPlan}
          onChange={(e) => set("subscriptionPlan", e.target.value)}
        />
      </Field>
      <Toggle
        label="Billed on dedicated Luna card (not customer's card)"
        checked={form.billedOnLunaCard}
        onChange={(v) => set("billedOnLunaCard", v)}
      />
      <Toggle
        label="Walk-test event detection triggered correctly"
        checked={form.walkTestEventDetectionOk}
        onChange={(v) => set("walkTestEventDetectionOk", v)}
      />

      <SectionTitle>7. Final verification & sign-off</SectionTitle>
      <Toggle
        label="Camera angle / FOV and panel angle re-verified post-mount"
        checked={form.postMountAngleVerified}
        onChange={(v) => set("postMountAngleVerified", v)}
      />
      <Toggle
        label="Live view still works post-mount"
        checked={form.liveViewPostMountOk}
        onChange={(v) => set("liveViewPostMountOk", v)}
      />
      <Toggle
        label="Event playback still works post-mount"
        checked={form.eventPlaybackPostMountOk}
        onChange={(v) => set("eventPlaybackPostMountOk", v)}
      />
      <Toggle
        label="Customer understands basic system function, no outstanding questions"
        checked={form.customerUnderstandsSystem}
        onChange={(v) => set("customerUnderstandsSystem", v)}
      />
      <Toggle
        label="Billing explained (1-yr trial via Luna account, no app-side charge, Alder bills separately)"
        checked={form.billingExplainedToCustomer}
        onChange={(v) => set("billingExplainedToCustomer", v)}
      />

      <SectionTitle>Notes</SectionTitle>
      <Field label="Additional notes / judgment calls">
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

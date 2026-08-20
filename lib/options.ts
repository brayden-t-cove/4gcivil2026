export const BATTERY_OPTIONS = [
  { value: "ok", label: "OK on arrival" },
  { value: "low_charged_before", label: "Low — charged before proceeding" },
  { value: "low_installed_anyway", label: "Low — installed anyway (explain in notes)" },
] as const;

export const SITE_TEST_RESULTS = [
  { value: "pass", label: "Pass — workable location found" },
  { value: "fail_coverage", label: "Fail — logged as coverage failure" },
] as const;

export const MOUNT_METHODS = [
  { value: "screws", label: "Screws" },
  { value: "zip_ties", label: "Zip ties (standard, not included ones)" },
] as const;

export const SUBSCRIPTION_PLANS = [
  { value: "single_pro", label: "Single Pro Plan" },
  { value: "multi_pro", label: "Multi Camera Pro Plan" },
  { value: "n_a", label: "N/A — not first camera on account" },
] as const;

export const FAILURE_CATEGORIES = [
  { value: "doa_wont_come_online", label: "DOA / won't come online" },
  { value: "coverage_failure", label: "Coverage failure (no workable location)" },
  { value: "connectivity_registration", label: "Connectivity / registration issue at pairing" },
  { value: "billing_payment_prompt", label: "App prompted for payment info (billing anomaly)" },
  { value: "event_detection_failure", label: "Event detection not triggering" },
  { value: "bluetooth_prompt", label: "Unexpected Bluetooth pairing prompt" },
  { value: "mounting_hardware", label: "Mounting hardware issue" },
  { value: "other", label: "Other" },
] as const;

export function labelFor(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined
) {
  return options.find((o) => o.value === value)?.label ?? value ?? "—";
}

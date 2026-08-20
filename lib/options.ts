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

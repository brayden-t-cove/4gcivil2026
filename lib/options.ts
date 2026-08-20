export const FAILURE_CATEGORIES = [
  { value: "doa_wont_come_online", label: "DOA / won't come online" },
  { value: "coverage_failure", label: "Coverage failure (no workable location)" },
  { value: "connectivity_registration", label: "Connectivity / registration issue at pairing" },
  { value: "wrong_card_used", label: "Entered customer's card by mistake instead of the provided Luna card" },
  { value: "event_detection_failure", label: "Event detection not triggering" },
  { value: "mounting_hardware", label: "Mounting hardware issue" },
  { value: "other", label: "Other" },
] as const;

export function labelFor(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined
) {
  return options.find((o) => o.value === value)?.label ?? value ?? "—";
}

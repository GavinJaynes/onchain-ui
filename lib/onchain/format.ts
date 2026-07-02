export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";

  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export type NumericValue = number | string | null | undefined;

/** Parses numbers and numeric strings; anything else becomes null. */
export function parseNumericValue(value: NumericValue): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}


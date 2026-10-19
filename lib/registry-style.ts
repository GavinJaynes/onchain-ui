/**
 * Which build a shadcn style gets from /r/{style}/{name}.json.
 *
 * shadcn names Base UI styles `base-*` (base-nova, base-vega, …). Everything
 * else is Radix: the legacy `new-york` and `default`, and `radix-*`. An
 * unknown future style falls to Radix too, the larger installed base.
 */
export function isBaseUiStyle(style: string): boolean {
  return style.startsWith("base-");
}

/** Styles shadcn ships today, prerendered. Others resolve at request time. */
export const KNOWN_STYLES = [
  "new-york",
  "default",
  ...["vega", "nova", "maia", "lyra", "mira"].flatMap((s) => [`radix-${s}`, `base-${s}`]),
];

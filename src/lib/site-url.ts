const DEFAULT_SITE_URL = "https://ycjgt.com";
const LEGACY_HOSTNAMES = new Set([
  "youcanjustgeneratethings.com",
  "www.youcanjustgeneratethings.com",
]);

function normalizeSiteUrl(rawValue?: string): string {
  if (!rawValue) return DEFAULT_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue}`;

  try {
    const parsed = new URL(withProtocol);
    if (LEGACY_HOSTNAMES.has(parsed.hostname.toLowerCase())) {
      return DEFAULT_SITE_URL;
    }
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL
);

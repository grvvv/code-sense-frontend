/**
 * Converts an ISO timestamp with microseconds to a human-readable format.
 *
 * @param isoTimestamp - A timestamp like "2025-07-27T14:51:36.689000"
 * @param options - Optional Intl.DateTimeFormat options
 * @returns A readable date string, e.g., "July 27, 2025, 2:51:36 PM"
 */
export function formatTimestamp(
  isoTimestamp: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!isoTimestamp || typeof isoTimestamp !== 'string') return '';

  // Remove last 3 digits from microseconds to fit JS Date format (milliseconds)
  const cleaned = isoTimestamp.slice(0, -3); // e.g., "2025-07-27T14:51:36.689"
  const date = new Date(cleaned);

  if (isNaN(date.getTime())) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  };

  return date.toLocaleString("en-US", { ...defaultOptions, ...options });
}

/** Shared display formatters for events. */

export function formatEventDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

/**
 * Card-style date: "Mon 14 Sept" (no year).
 * Uses timestamps (ms) from Algolia occurrence fields.
 */
export function formatCardDate(tsMs: number | null): string | null {
  if (tsMs === null) return null;
  const d = new Date(tsMs);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
}

/**
 * Card-style date range: "Mon 14 Sept - Mon 21 Sept".
 * If same day (or end is missing), only shows start.
 */
export function formatCardDateRange(
  startMs: number | null,
  endMs: number | null,
): string | null {
  const start = formatCardDate(startMs);
  if (!start) return null;
  const end = formatCardDate(endMs);
  if (!end || end === start) return start;
  return `${start} - ${end}`;
}

/**
 * Card-style time: "9:30am - 3:30pm".
 * Accepts ms timestamps for start and end.
 */
export function formatCardTime(
  startMs: number | null,
  endMs: number | null,
): string | null {
  if (startMs === null) return null;
  const fmt = (ms: number) =>
    new Date(ms)
      .toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Europe/London",
      })
      .replace(/ /g, "")
      .toLowerCase();
  const start = fmt(startMs);
  if (endMs === null) return start;
  const end = fmt(endMs);
  if (end === start) return start;
  return `${start} - ${end}`;
}

export function formatEventDateLong(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

export function formatDateRange(
  start: string | null,
  end: string | null,
): string | null {
  const startLong = formatEventDateLong(start);
  if (!startLong) return null;
  const endLong = formatEventDateLong(end);
  if (!endLong || endLong === startLong) return startLong;
  return `${startLong} – ${endLong}`;
}

export function formatPrice(price: string | null): string {
  if (price === null) return "See organiser";
  const value = Number(price);
  if (Number.isNaN(value)) return price;
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

export function formatDistance(meters: number | null): string | null {
  if (meters === null) return null;
  const miles = meters / 1609.344;
  if (miles < 0.1) return "Nearby";
  return `${miles.toFixed(miles < 10 ? 1 : 0)} miles away`;
}

/** Compose a short, human location line from event location fields. */
export function locationLine(parts: {
  online: boolean;
  locationName: string | null;
  locationCity: string | null;
  locationState: string | null;
}): string {
  if (parts.online) return "Online event";
  const segments = [parts.locationCity, parts.locationState].filter(
    (s): s is string => Boolean(s),
  );
  if (segments.length > 0) return segments.join(", ");
  return parts.locationName ?? "Location to be confirmed";
}

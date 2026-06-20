/** Shared helpers for the events date-range filter. Dates use `yyyy-mm-dd`. */

export type QuickRange = "today" | "tomorrow" | "weekend" | "next7";

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Compute `{ from, to }` (yyyy-mm-dd) for a quick-pick option, in local time. */
export function quickRangeDates(range: QuickRange): { from: string; to: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today":
      return { from: toISODate(today), to: toISODate(today) };
    case "tomorrow": {
      const t = new Date(today);
      t.setDate(t.getDate() + 1);
      return { from: toISODate(t), to: toISODate(t) };
    }
    case "weekend": {
      // Upcoming Saturday -> Sunday. If already weekend, use the current one.
      const day = today.getDay(); // 0 Sun ... 6 Sat
      const sat = new Date(today);
      if (day === 0) {
        sat.setDate(sat.getDate() - 1); // Sunday: weekend started Saturday
      } else {
        sat.setDate(sat.getDate() + (6 - day));
      }
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      return { from: toISODate(sat), to: toISODate(sun) };
    }
    case "next7": {
      const end = new Date(today);
      end.setDate(end.getDate() + 7);
      return { from: toISODate(today), to: toISODate(end) };
    }
  }
}

/** Lower bound (ms, UTC start of day) for a yyyy-mm-dd string, or undefined. */
export function dateFromMs(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const ms = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isNaN(ms) ? undefined : ms;
}

/** Upper bound (ms, UTC end of day) for a yyyy-mm-dd string, or undefined. */
export function dateToMs(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const ms = Date.parse(`${value}T23:59:59.999Z`);
  return Number.isNaN(ms) ? undefined : ms;
}

/** Which quick range, if any, the current from/to pair corresponds to. */
export function matchQuickRange(
  from: string | undefined,
  to: string | undefined,
): QuickRange | null {
  if (!from || !to) return null;
  for (const range of ["today", "tomorrow", "weekend", "next7"] as QuickRange[]) {
    const r = quickRangeDates(range);
    if (r.from === from && r.to === to) return range;
  }
  return null;
}

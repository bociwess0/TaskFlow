const LOCALE = "en-US";

const relativeTimeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

const RELATIVE_UNITS: Array<[unit: Intl.RelativeTimeFormatUnit, seconds: number]> = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** "2 minutes ago", "1 hour ago", "yesterday"... */
export function formatRelativeTime(date: string | Date, now = new Date()): string {
  const diffSeconds = (new Date(date).getTime() - now.getTime()) / 1000;
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return relativeTimeFormat.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return "just now";
}

/** "Sep 25" */
export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
}

/** "Dec 15, 2024" for an ISO date (YYYY-MM-DD), independent of the viewer's time zone. */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Mon, Sep 23, 2024" */
export function formatLongDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "Jan" for an ISO month start date (YYYY-MM-DD), independent of the viewer's time zone. */
export function formatMonth(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(LOCALE, { month: "short", timeZone: "UTC" });
}

/** Whole days from today until the given date (negative when overdue). */
export function daysUntil(date: string | Date, now = new Date()): number {
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  return Math.round((startOfDay(new Date(date)) - startOfDay(now)) / (24 * 60 * 60 * 1000));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Date helpers for mock data, so mock dates stay relative to today. */

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

/** Local date `days` from today as YYYY-MM-DD (negative for past dates). */
export function dateFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** ISO timestamp `minutes` before now. */
export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * MINUTE_MS).toISOString();
}

/** ISO timestamp `days` after now. */
export function daysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

/** First day of the month `offset` months before the current one, as YYYY-MM-DD. */
export function monthStart(offset: number): string {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - offset, 1));
  return date.toISOString().slice(0, 10);
}

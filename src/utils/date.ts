export function startOfDay(input: Date | string): Date {
  const date = typeof input === 'string' ? new Date(input) : new Date(input.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(input: Date | string, days: number): Date {
  const date = typeof input === 'string' ? new Date(input) : new Date(input.getTime());
  date.setDate(date.getDate() + days);
  return date;
}

/** Local YYYY-MM-DD key, matching what backend slot queries expect. */
export function toISODate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(a: Date | string, b: Date | string): boolean {
  return toISODate(a) === toISODate(b);
}

export function isToday(input: Date | string): boolean {
  return isSameDay(input, new Date());
}

export function isPast(input: Date | string): boolean {
  return new Date(input).getTime() < Date.now();
}

export function formatDate(input: Date | string): string {
  return new Date(input).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(input: Date | string): string {
  return new Date(input).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(input: Date | string): string {
  return `${formatDate(input)} · ${formatTime(input)}`;
}

export function formatTime(input: Date | string): string {
  return new Date(input).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Friendly label for a date relative to today (Today / Tomorrow / weekday). */
export function relativeDayLabel(input: Date | string): string {
  const target = startOfDay(input).getTime();
  const today = startOfDay(new Date()).getTime();
  const diffDays = Math.round((target - today) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return new Date(input).toLocaleDateString(undefined, { weekday: 'long' });
}

export function weekdayShort(input: Date | string): string {
  return new Date(input).toLocaleDateString(undefined, { weekday: 'short' });
}

export function dayNumber(input: Date | string): string {
  return String(new Date(input).getDate());
}

export function monthLabel(input: Date | string): string {
  return new Date(input).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/**
 * Converts UTC dates in an object to the local timezone offset.
 */
export function convertUTCToLocal(
  rows: Record<string, unknown>[],
  dateColumns?: string[]
): Record<string, unknown>[] {
  if (!dateColumns || dateColumns.length === 0) return rows;

  return rows.map((row) => {
    const newRow = { ...row };
    for (const col of dateColumns) {
      if (newRow[col] instanceof Date) {
        newRow[col] = new Date((newRow[col] as Date).getTime());
      }
    }
    return newRow;
  });
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string | null, includeTime = true): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  if (includeTime) {
    return d.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  return d.toLocaleDateString('es-AR');
}

/**
 * Returns a "time ago" human-readable string.
 */
export function timeAgo(date: Date | string | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 0) return 'ahora';

  const intervals: [number, string][] = [
    [31536000, 'año'],
    [2592000, 'mes'],
    [86400, 'día'],
    [3600, 'hora'],
    [60, 'min'],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      const plural = count > 1 ? (label === 'mes' ? 'es' : 's') : '';
      return `hace ${count} ${label}${plural}`;
    }
  }
  return 'hace segundos';
}

/**
 * Gets default from/to date range (last 24 hours).
 */
export function getDefaultDateRange(): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
  return { from, to };
}

/**
 * Gets a date range for the last N hours.
 */
export function getDateRangeHours(hours: number): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to.getTime() - hours * 60 * 60 * 1000);
  return { from, to };
}

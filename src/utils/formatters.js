/**
 * Display formatters for temperatures, dates, times, speeds, etc.
 */

/**
 * Format temperature with unit symbol
 */
export const fmtTemp = (val, units = 'metric') => {
  if (val === null || val === undefined) return '—';
  const sym = units === 'imperial' ? '°F' : '°C';
  return `${Math.round(val)}${sym}`;
};

/**
 * Short day name from date string (YYYY-MM-DD) or Date object
 */
export const fmtDay = (date, opts = { weekday: 'short' }) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : new Date(date);
    return d.toLocaleDateString('en-US', opts);
  } catch {
    return String(date);
  }
};

/**
 * Full day name
 */
export const fmtDayLong = (date) =>
  fmtDay(date, { weekday: 'long', month: 'short', day: 'numeric' });

/**
 * Format time string (HH:MM:SS or unix epoch) → "6:30 AM"
 */
export const fmtTime = (val) => {
  if (!val) return '—';
  try {
    // Unix epoch
    if (typeof val === 'number') {
      return new Date(val * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    // Already "HH:MM" or "HH:MM:SS"
    const [h, m] = String(val).split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return String(val);
  }
};

/**
 * Wind speed with unit label
 */
export const fmtWind = (speed, units = 'metric') => {
  if (speed === null || speed === undefined) return '—';
  const unit = units === 'imperial' ? 'mph' : 'km/h';
  return `${Math.round(speed)} ${unit}`;
};

/**
 * Humidity with % sign
 */
export const fmtHumidity = (val) =>
  val !== null && val !== undefined ? `${Math.round(val)}%` : '—';

/**
 * Pressure in hPa
 */
export const fmtPressure = (val) =>
  val !== null && val !== undefined ? `${Math.round(val)} hPa` : '—';

/**
 * Visibility in km
 */
export const fmtVisibility = (val) =>
  val !== null && val !== undefined ? `${Number(val).toFixed(1)} km` : '—';

/**
 * Precipitation probability %
 */
export const fmtPrecip = (val) =>
  val !== null && val !== undefined ? `${Math.round(val)}%` : '';

/**
 * Number abbreviation: 50000 → "50K"
 */
export const fmtNumber = (n) => {
  if (n === null || n === undefined) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

/**
 * Unix epoch → "Jun 5, 2026"
 */
export const fmtDate = (epoch) => {
  if (!epoch) return '—';
  return new Date(Number(epoch) * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

/**
 * Percentage string
 */
export const fmtPct = (used, total) => {
  if (!total) return '0%';
  return `${Math.round((used / total) * 100)}%`;
};

/**
 * Safe accessor — returns fallback if nested path is null/undefined
 */
export const get = (obj, path, fallback = '—') => {
  const val = path.split('.').reduce((acc, k) => acc?.[k], obj);
  return val !== null && val !== undefined ? val : fallback;
};

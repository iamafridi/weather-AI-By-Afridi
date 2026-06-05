/**
 * WeatherAI API Service
 * All requests to https://api.weather-ai.co/v1
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.weather-ai.co/v1';

// ─── Key management ────────────────────────────────────────────
export const getKey = () => localStorage.getItem('wai_api_key') || '';
export const setKey = (k) => localStorage.setItem('wai_api_key', k.trim());
export const getUnits = () => localStorage.getItem('wai_units') || 'metric';
export const setUnits = (u) => localStorage.setItem('wai_units', u);

// ─── Internal helpers ──────────────────────────────────────────
const authHeaders = () => ({ Authorization: `Bearer ${getKey()}` });

const buildUrl = (path, params = {}) => {
  const u = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  });
  return u.toString();
};

/**
 * Core fetch wrapper — surfaces rate-limit headers and maps status → friendly errors.
 * Retries once on 500/503 with 1s delay.
 * Supports AbortSignal for request cancellation.
 */
const request = async (url, options = {}, retry = 1) => {
  const res = await fetch(url, { ...options, headers: { ...authHeaders(), ...options.headers } });

  // Capture rate-limit metadata
  const meta = {
    limit:     res.headers.get('X-RateLimit-Limit'),
    remaining: res.headers.get('X-RateLimit-Remaining'),
    reset:     res.headers.get('X-RateLimit-Reset'),
    status:    res.status,
  };

  if (res.ok) {
    const data = await res.json();
    return { data, meta };
  }

  // Retry transient errors
  if ((res.status === 500 || res.status === 503) && retry > 0) {
    await new Promise((r) => setTimeout(r, 1000));
    return request(url, options, retry - 1);
  }

  // Map status codes to friendly messages
  const messages = {
    401: 'Invalid or missing API key. Enter your wai_ key in the topbar.',
    403: 'Your plan doesn\'t include this feature, or SMS is not yet enabled.',
    429: 'Monthly quota exceeded. Check your usage or upgrade your plan.',
    400: 'Bad request — check your parameters.',
    500: 'WeatherAI server error. Please try again shortly.',
    503: 'WeatherAI service temporarily unavailable.',
  };

  let body = {};
  try { body = await res.json(); } catch { /* ignore parse errors */ }

  const err = new Error(messages[res.status] || `Unexpected error (${res.status})`);
  err.status = res.status;
  err.body   = body;
  err.meta   = meta;
  throw err;
};

// ─── Weather endpoints ─────────────────────────────────────────

/**
 * Current weather + forecast by lat/lon
 * GET /v1/weather
 */
export const fetchWeatherByCoords = (lat, lon, days = 7, signal) =>
  request(buildUrl('/weather', { lat, lon, days, ai: true, units: getUnits() }), { signal });

/**
 * Current weather + forecast by city name
 * GET /v1/weather-geo
 */
export const fetchWeatherByCity = (city, days = 7, signal) =>
  request(buildUrl('/weather-geo', { q: city, days, ai: true, units: getUnits() }), { signal });

/**
 * Current conditions only
 * GET /v1/current
 */
export const fetchCurrent = (lat, lon) =>
  request(buildUrl('/current', { lat, lon, units: getUnits() }));

/**
 * Hourly forecast
 * GET /v1/hourly
 */
export const fetchHourly = (lat, lon) =>
  request(buildUrl('/hourly', { lat, lon, units: getUnits() }));

/**
 * Daily summary
 * GET /v1/daily
 */
export const fetchDaily = (lat, lon, days = 7) =>
  request(buildUrl('/daily', { lat, lon, days, units: getUnits() }));

// ─── Account endpoint ──────────────────────────────────────────

/**
 * Usage & quota
 * GET /v1/usage
 */
export const fetchUsage = () => request(buildUrl('/usage'));

// ─── IP Lookup ─────────────────────────────────────────────────

/**
 * Resolve IP address to geo coordinates
 * GET /v1/ip-lookup
 */
export const fetchIpLookup = (ip = 'auto') =>
  request(buildUrl('/ip-lookup', { ip }));

// ─── Agroforestry endpoints ────────────────────────────────────

/**
 * Tree crown analysis — multipart/form-data upload
 * POST /v1/trees/analyze
 */
export const analyzeTree = async ({ image, farmerId, county, landAcres, location, notes }) => {
  const form = new FormData();
  form.append('image', image);
  if (farmerId)  form.append('farmerId', farmerId);
  if (county)    form.append('county', county);
  if (landAcres) form.append('landAcres', String(landAcres));
  if (location)  form.append('location', location);
  if (notes)     form.append('notes', notes);

  const res = await fetch(buildUrl('/trees/analyze'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${getKey()}` }, // No Content-Type — browser sets multipart boundary
    body: form,
  });

  const meta = {
    limit:     res.headers.get('X-RateLimit-Limit'),
    remaining: res.headers.get('X-RateLimit-Remaining'),
    reset:     res.headers.get('X-RateLimit-Reset'),
    status:    res.status,
  };

  if (res.ok) {
    const data = await res.json();
    return { data, meta };
  }

  const messages = {
    401: 'Invalid API key.',
    403: 'Tree analysis requires at least the Free plan, or account not approved.',
    429: 'Monthly tree analysis quota exceeded.',
    400: 'Bad request — check your image and parameters.',
  };

  let body = {};
  try { body = await res.json(); } catch { /* ignore */ }

  const err = new Error(messages[res.status] || `Error ${res.status}`);
  err.status = res.status;
  err.body   = body;
  err.meta   = meta;
  throw err;
};

/**
 * Tree analysis history
 * GET /v1/trees/history
 */
export const fetchTreeHistory = (limit = 20, cursor) =>
  request(buildUrl('/trees/history', { limit, cursor }));

/**
 * Remaining tree analysis quota
 * GET /v1/trees/quota
 */
export const fetchTreeQuota = () => request(buildUrl('/trees/quota'));

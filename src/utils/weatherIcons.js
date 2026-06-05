/**
 * Maps weather condition codes / descriptions to emoji icons.
 * Handles both numeric WMO codes and text-based descriptions.
 */

const CODE_MAP = {
  0:   '☀️',  // Clear sky
  1:   '🌤️', // Mainly clear
  2:   '⛅',  // Partly cloudy
  3:   '☁️',  // Overcast
  45:  '🌫️', // Foggy
  48:  '🌫️', // Rime fog
  51:  '🌦️', // Light drizzle
  53:  '🌦️', // Moderate drizzle
  55:  '🌧️', // Dense drizzle
  61:  '🌧️', // Slight rain
  63:  '🌧️', // Moderate rain
  65:  '🌧️', // Heavy rain
  71:  '🌨️', // Slight snow
  73:  '🌨️', // Moderate snow
  75:  '❄️',  // Heavy snow
  77:  '🌨️', // Snow grains
  80:  '🌦️', // Slight showers
  81:  '🌧️', // Moderate showers
  82:  '⛈️',  // Violent showers
  85:  '🌨️', // Snow showers
  86:  '🌨️', // Heavy snow showers
  95:  '⛈️',  // Thunderstorm
  96:  '⛈️',  // Thunderstorm with hail
  99:  '⛈️',  // Heavy thunderstorm with hail
};

const TEXT_MAP = [
  { keys: ['clear', 'sunny'],                          icon: '☀️'  },
  { keys: ['mainly clear', 'mostly clear'],            icon: '🌤️' },
  { keys: ['partly cloudy', 'partly'],                 icon: '⛅'  },
  { keys: ['overcast', 'cloudy'],                      icon: '☁️'  },
  { keys: ['fog', 'mist', 'haze'],                     icon: '🌫️' },
  { keys: ['drizzle', 'light rain'],                   icon: '🌦️' },
  { keys: ['heavy rain', 'moderate rain', 'shower'],   icon: '🌧️' },
  { keys: ['rain'],                                    icon: '🌧️' },
  { keys: ['snow', 'blizzard', 'sleet'],               icon: '🌨️' },
  { keys: ['thunder', 'storm', 'lightning'],           icon: '⛈️'  },
  { keys: ['hail'],                                    icon: '🌩️' },
  { keys: ['wind', 'breezy'],                          icon: '💨'  },
  { keys: ['hot', 'heat'],                             icon: '🌡️' },
];

/**
 * Get weather emoji for a condition code or description string.
 * @param {number|string} condition - WMO code or description text
 * @returns {string} emoji
 */
export const getWeatherIcon = (condition) => {
  if (condition === null || condition === undefined) return '🌡️';

  // Numeric WMO code
  if (typeof condition === 'number') {
    return CODE_MAP[condition] ?? '🌡️';
  }

  // Text description
  const lower = String(condition).toLowerCase();
  for (const { keys, icon } of TEXT_MAP) {
    if (keys.some((k) => lower.includes(k))) return icon;
  }
  return '🌡️';
};

/**
 * UV index → label + color class
 */
export const uvLabel = (uv) => {
  if (uv === null || uv === undefined) return { label: '—', color: 'text-muted' };
  if (uv <= 2)  return { label: 'Low',       color: 'text-wgreen'  };
  if (uv <= 5)  return { label: 'Moderate',  color: 'text-wyellow' };
  if (uv <= 7)  return { label: 'High',      color: 'text-worange' };
  if (uv <= 10) return { label: 'Very High', color: 'text-wred'    };
  return             { label: 'Extreme',   color: 'text-wpurple' };
};

/**
 * WMO weather condition code → human-readable description
 */
const WMO_DESC = {
  0:  'Clear sky',
  1:  'Mainly clear',
  2:  'Partly cloudy',
  3:  'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail',
};

export const wmoDescription = (code) => {
  if (code === null || code === undefined) return '';
  if (typeof code === 'number') return WMO_DESC[code] ?? '';
  return String(code);
};

/**
 * Wind direction degrees → compass abbreviation
 */
export const windDir = (deg) => {
  if (deg === null || deg === undefined) return '';
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
};

import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind, Sun, Gauge } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { getWeatherIcon, uvLabel, windDir } from '../../utils/weatherIcons';
import { fmtTemp, fmtHumidity, fmtWind, fmtPressure, get } from '../../utils/formatters';

export default function CurrentCard() {
  const { state } = useWeatherContext();
  const w   = state.weather;
  const loc = state.location;
  const units = state.units;

  // Try various known response shapes from the API
  const current = w?.current ?? w?.data?.current ?? w;
  const temp       = get(current, 'temp') ?? get(current, 'temperature');
  const feelsLike  = get(current, 'feels_like') ?? get(current, 'feelslike');
  const desc       = get(current, 'description') ?? get(current, 'condition') ?? get(current, 'weather_description', '');
  const humidity   = get(current, 'humidity');
  const wind       = get(current, 'wind_speed') ?? get(current, 'windspeed');
  const windDeg    = get(current, 'wind_direction') ?? get(current, 'winddirection', null);
  const uvIdx      = get(current, 'uv_index') ?? get(current, 'uvi', null);
  const pressure   = get(current, 'pressure');
  const condition  = get(current, 'condition_code') ?? get(current, 'code') ?? desc;
  const icon       = getWeatherIcon(condition === '—' ? desc : condition);
  const { label: uvText, color: uvColor } = uvLabel(uvIdx === '—' ? null : uvIdx);

  const stats = [
    { Icon: Droplets, label: 'Humidity',  value: fmtHumidity(humidity === '—' ? null : humidity) },
    { Icon: Wind,     label: 'Wind',      value: fmtWind(wind === '—' ? null : wind, units) + (windDeg !== null && windDeg !== '—' ? ` ${windDir(windDeg)}` : '') },
    { Icon: Sun,      label: 'UV Index',  value: uvIdx === '—' ? '—' : uvIdx, extra: uvText, color: uvColor },
    { Icon: Gauge,    label: 'Pressure',  value: fmtPressure(pressure === '—' ? null : pressure) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 min-h-[300px] flex flex-col"
    >
      {/* Location + live badge */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin size={14} className="text-accent flex-shrink-0" />
        <span className="font-semibold text-[14px] text-wtext truncate">{loc?.name ?? '—'}</span>
        <div className="live-badge ml-auto">
          <span className="w-1.5 h-1.5 bg-wgreen rounded-full animate-pulse-glow" />
          LIVE
        </div>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start">
          <span className="text-[80px] font-black leading-none tracking-[-0.05em] text-white">
            {temp === '—' ? '—' : Math.round(temp)}
          </span>
          <span className="text-[28px] font-light text-wtext2 mt-3 ml-1">
            {units === 'imperial' ? '°F' : '°C'}
          </span>
        </div>
        <span className="text-[68px] leading-none animate-float select-none" style={{ filter: 'drop-shadow(0 0 20px rgba(42,245,200,0.25))' }}>
          {icon}
        </span>
      </div>

      {/* Condition + feels like */}
      <p className="text-[18px] font-semibold text-wtext capitalize mb-1">{String(desc).toLowerCase()}</p>
      <p className="text-[13px] text-muted mb-5">
        Feels like{' '}
        <span className="text-wtext2 font-medium">
          {feelsLike === '—' ? '—' : fmtTemp(feelsLike, units)}
        </span>
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/[0.06] pt-4 mt-auto">
        {stats.map(({ Icon, label, value, extra, color }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <Icon size={14} className="text-accent/70" />
            <span className="font-mono text-[9px] text-muted tracking-wider uppercase">{label}</span>
            <span className={`text-[13px] font-semibold ${color ?? 'text-wtext'}`}>{value}</span>
            {extra && <span className="text-[10px] text-muted">{extra}</span>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

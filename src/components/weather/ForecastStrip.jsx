import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useWeatherContext } from '../../context/useWeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { fmtDay, fmtPrecip } from '../../utils/formatters';

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ForecastStrip() {
  const { state } = useWeatherContext();
  const w = state.weather;

  // Support various response shapes
  const forecast =
    w?.forecast ??
    w?.daily ??
    w?.data?.forecast ??
    w?.data?.daily ??
    [];

  const days = Array.isArray(forecast) ? forecast.slice(0, 7) : [];

  if (!w && !state.loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[14px] text-wtext">7-Day Forecast</h3>
        <div className="flex items-center gap-1.5 text-accent2 text-[10px] font-mono bg-accent2/10 border border-accent2/20 rounded-full px-2.5 py-0.5">
          <Lock size={9} />
          14-day on Pro
        </div>
      </div>

      {state.loading && !w ? (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-bg4 rounded-lg h-28 skeleton" />
          ))}
        </div>
      ) : days.length === 0 ? (
        <p className="text-muted text-[13px] text-center py-6">Forecast data unavailable.</p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2"
        >
          {days.map((day, idx) => {
            const dateStr = day.date ?? day.day ?? day.time ?? '';
            const isToday = idx === 0;
            const hi      = day.temp_max ?? day.maxtemp_c ?? day.high ?? day.max ?? '—';
            const lo      = day.temp_min ?? day.mintemp_c ?? day.low  ?? day.min ?? '—';
            const desc    = day.description ?? day.condition ?? day.summary ?? '';
            const precip  = day.precipitation_probability ?? day.pop ?? day.precip_prob ?? null;
            const icon    = getWeatherIcon(day.condition_code ?? day.code ?? desc);

            return (
              <motion.div
                key={idx}
                variants={item}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all cursor-default
                  ${isToday
                    ? 'border-accent/35 bg-accent/5'
                    : 'border-white/[0.06] bg-bg4 hover:border-accent/20 hover:bg-accent/[0.03]'
                  }`}
              >
                <span className={`font-semibold text-[10px] uppercase tracking-wider ${isToday ? 'text-accent' : 'text-muted'}`}>
                  {isToday ? 'Today' : fmtDay(dateStr)}
                </span>
                <span className="text-[26px] leading-none">{icon}</span>
                <span className="font-bold text-[14px] text-wtext">
                  {hi === '—' ? '—' : Math.round(hi)}°
                </span>
                <span className="text-[12px] text-muted">
                  {lo === '—' ? '—' : Math.round(lo)}°
                </span>
                {precip !== null && (
                  <span className="text-[10px] text-accent2 font-mono">{fmtPrecip(precip)}</span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

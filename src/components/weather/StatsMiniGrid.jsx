import { motion } from 'framer-motion';
import { Wind, Sunrise, Sunset, Droplets } from 'lucide-react';
import { useWeatherContext } from '../../context/useWeatherContext';
import { fmtTime, fmtWind, get } from '../../utils/formatters';

export default function StatsMiniGrid() {
  const { state } = useWeatherContext();
  const w = state.weather;
  if (!w) return null;

  const current = w?.current ?? w?.data?.current ?? w;
  const day0    = w?.daily?.[0];

  const stats = [
    {
      icon: <Wind size={22} className="text-accent2" />,
      label: 'Wind Gust',
      value: fmtWind(get(current, 'wind_gust', null) === '—' ? null : get(current, 'wind_gust', null), state.units),
    },
    {
      icon: <Sunrise size={22} className="text-wyellow" />,
      label: 'Sunrise',
      value: fmtTime(day0?.sunrise ?? null),
    },
    {
      icon: <Sunset size={22} className="text-worange" />,
      label: 'Sunset',
      value: fmtTime(day0?.sunset ?? null),
    },
    {
      icon: <Droplets size={22} className="text-accent" />,
      label: 'Precip Sum',
      value: day0?.precipitation_sum !== null && day0?.precipitation_sum !== undefined
        ? `${Math.round(day0.precipitation_sum)} mm`
        : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon, label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
          className="glass p-5 flex flex-col gap-2"
        >
          {icon}
          <span className="font-mono text-[10px] text-muted tracking-wider uppercase">{label}</span>
          <span className="text-[20px] font-bold text-wtext tracking-tight">{value}</span>
        </motion.div>
      ))}
    </div>
  );
}

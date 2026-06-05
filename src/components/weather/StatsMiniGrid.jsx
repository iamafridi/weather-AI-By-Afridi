import { motion } from 'framer-motion';
import { Eye, Sunrise, Sunset, Thermometer } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { fmtTime, fmtVisibility, get } from '../../utils/formatters';

export default function StatsMiniGrid() {
  const { state } = useWeatherContext();
  const w = state.weather;
  if (!w) return null;

  const current = w?.current ?? w?.data?.current ?? w;

  const stats = [
    {
      icon: <Eye size={22} className="text-accent2" />,
      label: 'Visibility',
      value: fmtVisibility(get(current, 'visibility', null) === '—' ? null : get(current, 'visibility', null)),
    },
    {
      icon: <Sunrise size={22} className="text-wyellow" />,
      label: 'Sunrise',
      value: fmtTime(get(current, 'sunrise', null) === '—' ? null : get(current, 'sunrise', null)),
    },
    {
      icon: <Sunset size={22} className="text-worange" />,
      label: 'Sunset',
      value: fmtTime(get(current, 'sunset', null) === '—' ? null : get(current, 'sunset', null)),
    },
    {
      icon: <Thermometer size={22} className="text-wred" />,
      label: 'Dew Point',
      value: get(current, 'dew_point', null) === null || get(current, 'dew_point', null) === '—'
        ? '—'
        : `${Math.round(get(current, 'dew_point'))}°`,
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

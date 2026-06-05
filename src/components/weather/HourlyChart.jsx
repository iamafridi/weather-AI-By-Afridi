import { motion } from 'framer-motion';
import { useWeatherContext } from '../../context/WeatherContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg3 border border-white/10 rounded-lg px-3 py-2 text-[12px] shadow-glass">
      <p className="text-muted font-mono mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {Math.round(p.value)}{p.name === 'Temp' ? '°' : '%'}
        </p>
      ))}
    </div>
  );
};

export default function HourlyChart() {
  const { state } = useWeatherContext();
  const hourly = state.hourly;

  // Normalise various response shapes
  const rawHours =
    hourly?.hourly ??
    hourly?.data?.hourly ??
    (Array.isArray(hourly) ? hourly : null);

  if (!rawHours && !state.hourlyLoading) return null;

  const chartData = rawHours
    ? rawHours.slice(0, 24).map((h) => ({
        time:   h.time ?? h.hour ?? h.datetime ?? '—',
        Temp:   h.temp ?? h.temperature ?? h.temp_c ?? 0,
        Rain:   h.precipitation_probability ?? h.pop ?? h.humidity ?? 0,
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[14px] text-wtext">24-Hour Temperature</h3>
        <div className="flex items-center gap-4 text-[11px] text-muted font-mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-accent inline-block rounded" />Temp</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-accent2 inline-block rounded" />Rain %</span>
        </div>
      </div>

      {state.hourlyLoading ? (
        <div className="h-[200px] skeleton rounded-lg" />
      ) : chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted text-[13px]">
          Hourly data unavailable.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2af5c8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2af5c8" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#6b8aaa', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6b8aaa', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Temp" stroke="#2af5c8" strokeWidth={2} fill="url(#tempGrad)" dot={false} />
            <Area type="monotone" dataKey="Rain" stroke="#0ea5e9" strokeWidth={1.5} fill="url(#rainGrad)" dot={false} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

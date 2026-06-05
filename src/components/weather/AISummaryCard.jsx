import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import Skeleton from '../ui/Skeleton';

export default function AISummaryCard() {
  const { state } = useWeatherContext();
  const w = state.weather;

  const summary =
    w?.ai_summary ??
    w?.summary ??
    w?.ai ??
    w?.data?.ai_summary ??
    null;

  const aiDisabled = w && !summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass p-6 flex flex-col min-h-[300px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-bold text-[14px] text-wtext">
          <Sparkles size={15} className="text-accent" />
          AI Weather Summary
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5 tracking-wider">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
          Gemini AI
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {state.loading && !w ? (
          <Skeleton lines={5} />
        ) : aiDisabled ? (
          <div className="flex flex-col items-center gap-3 text-center py-6">
            <span className="text-[40px] opacity-40">🤖</span>
            <p className="text-[13px] text-muted max-w-[220px] leading-relaxed">
              AI summary not available for this location or add{' '}
              <code className="font-mono text-accent text-[11px]">?ai=true</code> is disabled by quota.
            </p>
          </div>
        ) : !w ? (
          <div className="flex flex-col items-center gap-3 text-center py-6">
            <span className="text-[40px] opacity-30">✨</span>
            <p className="text-[13px] text-muted">AI summary will appear here after you search a city.</p>
          </div>
        ) : (
          <motion.p
            key={summary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[14px] text-wtext2 leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: summary?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-wtext">$1</strong>') ?? '' }}
          />
        )}
      </div>
    </motion.div>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { useWeatherContext } from '../../context/WeatherContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={16} className="text-wgreen" />,
  error:   <AlertCircle size={16} className="text-wred" />,
  warning: <AlertTriangle size={16} className="text-wyellow" />,
  info:    <Info size={16} className="text-accent2" />,
};

const borders = {
  success: 'border-wgreen/30',
  error:   'border-wred/30',
  warning: 'border-wyellow/30',
  info:    'border-accent2/30',
};

export default function Toast() {
  const { state, removeToast } = useWeatherContext();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {state.toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{   x: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`pointer-events-auto flex items-start gap-3 bg-bg3 border ${borders[t.type] ?? 'border-white/10'} rounded-xl px-4 py-3 shadow-glass max-w-xs backdrop-blur-md`}
          >
            <span className="mt-0.5 flex-shrink-0">{icons[t.type] ?? icons.info}</span>
            <p className="text-[13px] text-wtext leading-snug flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted hover:text-wtext transition-colors ml-1 mt-0.5 flex-shrink-0"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

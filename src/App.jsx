import { AnimatePresence, motion } from 'framer-motion';
import { useWeatherContext } from './context/useWeatherContext';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';
import Hero from './components/hero/Hero';
import CurrentCard from './components/weather/CurrentCard';
import AISummaryCard from './components/weather/AISummaryCard';
import ForecastStrip from './components/weather/ForecastStrip';
import HourlyChart from './components/weather/HourlyChart';
import StatsMiniGrid from './components/weather/StatsMiniGrid';
import AgroSection from './components/agro/AgroSection';
import UsageSection from './components/usage/UsageSection';
import PlansSection from './components/plans/PlansSection';
import Toast from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  const { state } = useWeatherContext();
  const { weather, loading, error } = state;

  return (
    <ErrorBoundary>
    <div className="min-h-screen flex flex-col">
      {/* Background ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-20 w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(42,245,200,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)' }} />
      </div>

      <Topbar />

      <main className="flex-1 relative z-10">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">

          {/* Hero / Search */}
          <Hero />

          {/* ── Weather Dashboard ─────────────────────────── */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-wred/8 border border-wred/25 rounded-xl px-5 py-4 mb-6 text-[13px] text-wred"
              >
                <span className="text-[18px]">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          {loading && !weather && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="glass p-6 min-h-[300px] skeleton" />
              <div className="glass p-6 min-h-[300px] skeleton" />
            </div>
          )}

          {/* Weather content */}
          <AnimatePresence mode="wait">
            {weather && (
              <motion.div
                key={state.location?.name}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top row: current + AI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <CurrentCard />
                  <AISummaryCard />
                </div>

                {/* Forecast strip */}
                <div className="mb-5"><ForecastStrip /></div>

                {/* Hourly chart */}
                <div className="mb-5"><HourlyChart /></div>

                {/* Mini stats */}
                <div className="mb-16"><StatsMiniGrid /></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state — no search yet */}
          {!weather && !loading && !error && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center mb-16">
              <span className="text-[64px]">🌍</span>
              <h3 className="text-[18px] font-semibold text-wtext">Search a city or use GPS</h3>
              <p className="text-muted text-[14px] max-w-[300px]">
                Start by searching a city above to see live weather, AI summaries, and forecasts.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/[0.06] mb-16" />

          {/* Agroforestry */}
          <AgroSection />

          {/* Divider */}
          <div className="border-t border-white/[0.06] mb-16" />

          {/* Usage */}
          <UsageSection />

          {/* Plans */}
          <PlansSection />
        </div>
      </main>

      <Footer />
      <Toast />
    </div>
    </ErrorBoundary>
  );
}

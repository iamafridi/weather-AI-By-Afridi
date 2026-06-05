import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { scrollReveal } from '../../utils/animations';
import { useUsage } from '../../hooks/useUsage';
import { fmtNumber, fmtDate } from '../../utils/formatters';
import DonutChart from '../ui/DonutChart';
import Skeleton from '../ui/Skeleton';

export default function UsageSection() {
  const { usage, usageLoading, usageError, loadUsage } = useUsage();
  const sectionRef = useRef(null);

  useEffect(() => {
    loadUsage();
    if (sectionRef.current) {
      scrollReveal(sectionRef.current.querySelectorAll('.usage-card'), { stagger: 0.1 });
    }
  }, []); // eslint-disable-line

  // Normalise response shapes
  const requests    = usage?.requests_used     ?? usage?.requests    ?? usage?.usage?.requests    ?? null;
  const reqLimit    = usage?.requests_limit    ?? usage?.limit       ?? usage?.plan?.requests     ?? null;
  const aiRequests  = usage?.ai_requests_used  ?? usage?.ai_requests ?? usage?.usage?.ai_requests ?? null;
  const aiLimit     = usage?.ai_requests_limit ?? usage?.plan?.ai_requests ?? null;
  const periodStart = usage?.period_start ?? usage?.billing_start ?? null;
  const periodEnd   = usage?.period_end   ?? usage?.billing_end   ?? null;
  const plan        = usage?.plan_name    ?? usage?.plan          ?? 'Free';

  const reqPct = reqLimit ? Math.round((requests / reqLimit) * 100) : 0;
  const aiPct  = aiLimit  ? Math.round((aiRequests / aiLimit) * 100) : 0;

  return (
    <section className="mb-20" ref={sectionRef}>
      <div className="mb-8">
        <p className="eyebrow mb-3">API Usage</p>
        <h2 className="text-[clamp(26px,4vw,40px)] font-black tracking-[-0.04em] text-white mb-3">
          Your Quota
        </h2>
        <p className="text-wtext2 text-[14px]">
          Current plan:{' '}
          <span className={`font-mono font-bold ${plan === 'Scale' ? 'text-accent' : plan === 'Pro' ? 'text-accent2' : 'text-muted'}`}>
            {plan}
          </span>
          {periodEnd && (
            <span className="text-muted ml-3 text-[13px]">· Resets {fmtDate(periodEnd)}</span>
          )}
        </p>
      </div>

      {usageLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="glass p-6"><Skeleton lines={4} /></div>)}
        </div>
      ) : usageError ? (
        <div className="glass p-8 text-center text-muted text-[14px]">
          <span className="text-[32px] block mb-3 opacity-40">📊</span>
          {usageError.includes('401') || usageError.includes('key')
            ? 'Enter your API key in the topbar to view usage data.'
            : usageError}
        </div>
      ) : !usage ? (
        <div className="glass p-8 text-center text-muted text-[14px]">
          <span className="text-[32px] block mb-3 opacity-40">📊</span>
          Save your API key to load usage stats.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* API Requests */}
          <motion.div
            className="usage-card glass p-6 flex flex-col items-center text-center gap-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <DonutChart pct={reqPct} color="#2af5c8" size={100} stroke={10}>
              <span className="font-black text-[18px] text-wtext">{reqPct}%</span>
            </DonutChart>
            <div>
              <div className="font-bold text-[14px] text-wtext">API Requests</div>
              <div className="text-[13px] text-muted mt-1">
                <span className="text-accent font-semibold">{fmtNumber(requests)}</span>
                {' '}/ {fmtNumber(reqLimit)} used
              </div>
            </div>
          </motion.div>

          {/* AI Requests */}
          <motion.div
            className="usage-card glass p-6 flex flex-col items-center text-center gap-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <DonutChart pct={aiPct} color="#0ea5e9" size={100} stroke={10}>
              <span className="font-black text-[18px] text-wtext">{aiPct}%</span>
            </DonutChart>
            <div>
              <div className="font-bold text-[14px] text-wtext">AI Requests</div>
              <div className="text-[13px] text-muted mt-1">
                <span className="text-accent2 font-semibold">{fmtNumber(aiRequests)}</span>
                {' '}/ {fmtNumber(aiLimit)} used
              </div>
            </div>
          </motion.div>

          {/* Billing period */}
          <motion.div
            className="usage-card glass p-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className="font-bold text-[14px] text-wtext">Billing Period</div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Start</span>
                <span className="text-wtext font-medium">{fmtDate(periodStart)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">End</span>
                <span className="text-wtext font-medium">{fmtDate(periodEnd)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Plan</span>
                <span className={`font-semibold ${plan === 'Scale' ? 'text-accent' : plan === 'Pro' ? 'text-accent2' : 'text-muted'}`}>
                  {plan}
                </span>
              </div>
            </div>
            <a
              href="https://weather-ai.co"
              target="_blank"
              rel="noreferrer"
              className="mt-auto w-full text-center bg-accent/10 border border-accent/20 text-accent text-[12px] font-semibold py-2 rounded-lg hover:bg-accent/20 transition-all"
            >
              Upgrade Plan →
            </a>
          </motion.div>
        </div>
      )}
    </section>
  );
}

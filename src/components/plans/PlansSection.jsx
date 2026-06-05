import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Perfect for personal projects and exploration.',
    badge: 'plan-badge-free',
    highlight: false,
    features: [
      { text: '1,000 requests / month',      ok: true  },
      { text: '200 AI requests / month',      ok: true  },
      { text: '7-day forecast',               ok: true  },
      { text: '5 tree analyses / month',      ok: true  },
      { text: 'Webhooks',                     ok: false },
      { text: 'SMS / USSD delivery',          ok: false },
      { text: '1 team seat',                  ok: true  },
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    desc: 'For developers building production apps.',
    badge: 'plan-badge-pro',
    highlight: true,
    features: [
      { text: '50,000 requests / month',      ok: true  },
      { text: '10,000 AI requests / month',   ok: true  },
      { text: '14-day forecast',              ok: true  },
      { text: '100 tree analyses / month',    ok: true  },
      { text: 'Webhooks (up to 10)',          ok: true  },
      { text: 'SMS / USSD delivery',          ok: false },
      { text: '5 team seats',                 ok: true  },
    ],
  },
  {
    name: 'Scale',
    price: '$149',
    desc: 'Unlimited power for large-scale platforms.',
    badge: 'plan-badge-scale',
    highlight: false,
    features: [
      { text: '500,000 requests / month',     ok: true  },
      { text: '100,000 AI requests / month',  ok: true  },
      { text: '16-day forecast',              ok: true  },
      { text: 'Unlimited tree analyses',      ok: true  },
      { text: 'Webhooks (up to 50)',          ok: true  },
      { text: 'SMS / USSD delivery',          ok: true  },
      { text: '20 team seats',               ok: true  },
    ],
  },
];

export default function PlansSection() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <p className="eyebrow mb-3">Plans &amp; Limits</p>
        <h2 className="text-[clamp(26px,4vw,40px)] font-black tracking-[-0.04em] text-white mb-3">
          Built to Scale
        </h2>
        <p className="text-wtext2 text-[14px] max-w-[480px]">
          Start free and upgrade as you grow. All plans include Gemini AI summaries and OpenCV tree analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`glass relative p-6 flex flex-col gap-5 ${
              plan.highlight ? 'border-accent/30 shadow-glow' : ''
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-accent text-bg text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase">
                <Zap size={9} /> Most Popular
              </div>
            )}

            <div>
              <span className={plan.badge}>{plan.name}</span>
              <div className="text-[32px] font-black text-white tracking-tight mt-3">
                {plan.price}<span className="text-[16px] font-normal text-muted">/mo</span>
              </div>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">{plan.desc}</p>
            </div>

            <ul className="flex flex-col gap-2.5 flex-1">
              {plan.features.map(({ text, ok }) => (
                <li key={text} className="flex items-center gap-2.5 text-[13px]">
                  {ok
                    ? <Check size={13} className="text-wgreen flex-shrink-0" />
                    : <X     size={13} className="text-muted2 flex-shrink-0" />
                  }
                  <span className={ok ? 'text-wtext2' : 'text-muted2'}>{text}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://weather-ai.co"
              target="_blank"
              rel="noreferrer"
              className={`w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                plan.highlight
                  ? 'bg-accent text-bg hover:opacity-85'
                  : 'bg-bg4 border border-white/10 text-wtext2 hover:border-accent/30 hover:text-accent'
              }`}
            >
              Get Started →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

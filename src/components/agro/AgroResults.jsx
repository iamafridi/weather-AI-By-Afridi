import { motion } from 'framer-motion';
import { Trees, Leaf, AlertCircle } from 'lucide-react';

export default function AgroResults({ data }) {
  if (!data) return null;

  const total     = data.total_tree_count ?? 0;
  const density   = data.tree_density_per_acre ?? null;
  const canopy    = data.canopy_coverage_pct ?? null;
  const confidence = data.confidence_score ?? null;
  const health    = data.tree_health ?? {};
  const healthy   = health.healthy ?? 0;
  const needsCare = health.needs_care ?? 0;
  const needsRep  = health.needs_replacement ?? 0;
  const healthTotal = healthy + needsCare + needsRep || 1;

  const observations   = data.observations ?? [];
  const recommendations = data.recommendations ?? [];

  const pct = (n) => Math.round((n / healthTotal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 22 }}
      className="flex flex-col gap-4"
    >
      {/* Images */}
      {(data.original_image_url || data.overlay_image_url) && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { url: data.original_image_url, label: 'Original' },
            { url: data.overlay_image_url,  label: 'Overlay'  },
          ].map(({ url, label }) => url && (
            <div key={label} className="relative rounded-xl overflow-hidden border border-white/[0.06]">
              <img src={url} alt={label} className="w-full h-[140px] object-cover" />
              <span className="absolute bottom-2 left-2 font-mono text-[9px] font-bold text-white bg-black/60 rounded px-1.5 py-0.5 tracking-wider uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Trees size={16} className="text-accent" />, val: total,                            label: 'Trees'       },
          { icon: <Leaf  size={16} className="text-wgreen" />, val: density ? density.toFixed(1) : '—', label: 'Trees/Acre'  },
          { icon: <span className="text-[14px]">🌿</span>,      val: canopy ? `${canopy}%` : '—',       label: 'Canopy Cover'},
        ].map(({ icon, val, label }) => (
          <div key={label} className="glass p-4 text-center">
            <div className="flex justify-center mb-2">{icon}</div>
            <div className="text-[22px] font-black text-accent tracking-tight">{val}</div>
            <div className="font-mono text-[9px] text-muted tracking-wider uppercase mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Confidence */}
      {confidence && (
        <div className="glass px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted">Confidence Score</span>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 bg-bg4 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${confidence * 100}%` }} />
            </div>
            <span className="font-bold text-[13px] text-wtext">{Math.round(confidence * 100)}%</span>
          </div>
        </div>
      )}

      {/* Health bars */}
      <div className="glass p-5">
        <h4 className="font-bold text-[13px] text-wtext mb-4 flex items-center gap-2">
          <Leaf size={13} className="text-accent" /> Tree Health Breakdown
        </h4>
        {[
          { label: 'Healthy',         count: healthy,   pct: pct(healthy),   color: 'bg-wgreen'  },
          { label: 'Needs Care',      count: needsCare, pct: pct(needsCare), color: 'bg-wyellow' },
          { label: 'Needs Replanting',count: needsRep,  pct: pct(needsRep),  color: 'bg-wred'    },
        ].map(({ label, count, pct: p, color }) => (
          <div key={label} className="flex items-center gap-3 mb-2.5 last:mb-0">
            <span className="text-[12px] text-wtext2 w-36 flex-shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-bg4 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${color}`}
              />
            </div>
            <span className="font-semibold text-[12px] text-wtext w-6 text-right">{count}</span>
          </div>
        ))}
      </div>

      {/* Species */}
      {data.tree_species_guess && (
        <div className="glass px-4 py-3 flex items-center gap-3">
          <span className="text-[20px]">🌱</span>
          <div>
            <div className="font-mono text-[10px] text-muted tracking-wider uppercase mb-0.5">Detected Species</div>
            <div className="text-[13px] font-semibold text-wtext">{data.tree_species_guess}</div>
          </div>
        </div>
      )}

      {/* Observations */}
      {observations.length > 0 && (
        <div className="glass p-5">
          <h4 className="font-bold text-[13px] text-wtext mb-3 flex items-center gap-2">
            <AlertCircle size={13} className="text-wyellow" /> Observations
          </h4>
          <ul className="flex flex-col gap-2">
            {observations.map((obs, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-wtext2 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                {obs}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass p-5">
          <h4 className="font-bold text-[13px] text-wtext mb-3 flex items-center gap-2">
            <span className="text-[13px]">✅</span> Recommendations
          </h4>
          <ul className="flex flex-col gap-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-wgreen leading-relaxed">
                <span className="w-1.5 h-1.5 bg-wgreen rounded-full mt-2 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

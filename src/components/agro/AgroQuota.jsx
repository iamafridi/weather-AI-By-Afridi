import { useTreeQuota } from '../../hooks/useTreeQuota';
import Skeleton from '../ui/Skeleton';

export default function AgroQuota() {
  const { quota, loading, error } = useTreeQuota();

  if (loading) return <div className="glass p-3"><Skeleton lines={1} /></div>;
  if (error || !quota) return null;

  const pct = quota.limit ? Math.round((quota.used / quota.limit) * 100) : 0;

  return (
    <div className="glass px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[16px]">🌳</span>
        <span className="font-mono text-[11px] text-muted">Tree Analysis Quota</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-1.5 bg-bg4 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pct >= 90 ? 'bg-wred' : pct >= 70 ? 'bg-wyellow' : 'bg-accent'
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className="font-bold text-[12px] text-wtext font-mono">
          {quota.used}{quota.unlimited ? '+ / ∞' : ` / ${quota.limit} used`}
        </span>
      </div>
    </div>
  );
}

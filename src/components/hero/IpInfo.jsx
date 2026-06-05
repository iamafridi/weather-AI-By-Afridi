import { MapPin } from 'lucide-react';
import { useIpLookup } from '../../hooks/useIpLookup';

export default function IpInfo() {
  const { info, loading } = useIpLookup();

  if (loading || !info?.geo) return null;

  return (
    <div className="flex items-center gap-1.5 mt-4 text-[11px] text-muted font-mono">
      <MapPin size={10} className="text-accent" />
      <span>Detected: {info.geo.city}, {info.geo.region}, {info.geo.country}</span>
      {info.geo.timezone && (
        <>
          <span className="text-muted2 mx-1">·</span>
          <span>{info.geo.timezone}</span>
        </>
      )}
    </div>
  );
}

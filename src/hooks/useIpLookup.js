import { useState, useEffect, startTransition } from 'react';
import { fetchIpLookup } from '../services/api';
import { useWeatherContext } from '../context/useWeatherContext';

export const useIpLookup = () => {
  const { state } = useWeatherContext();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const ready = Boolean(state.apiKey);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    startTransition(() => setLoading(true));
    fetchIpLookup('auto')
      .then(({ data }) => { if (!cancelled) setInfo(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ready]);

  return { info, loading };
};

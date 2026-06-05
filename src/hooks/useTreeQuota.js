import { useState, useEffect, startTransition } from 'react';
import { fetchTreeQuota } from '../services/api';
import { useWeatherContext } from '../context/useWeatherContext';

export const useTreeQuota = () => {
  const { state } = useWeatherContext();
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ready = Boolean(state.apiKey);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    startTransition(() => setLoading(true));
    fetchTreeQuota()
      .then(({ data }) => { if (!cancelled) setQuota(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ready]);

  return { quota, loading, error };
};

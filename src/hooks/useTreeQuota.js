import { useState, useEffect } from 'react';
import { fetchTreeQuota } from '../services/api';
import { useWeatherContext } from '../context/WeatherContext';

export const useTreeQuota = () => {
  const { state } = useWeatherContext();
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state.apiKey) return;
    let cancelled = false;
    setLoading(true);
    fetchTreeQuota()
      .then(({ data }) => { if (!cancelled) setQuota(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [state.apiKey]);

  return { quota, loading, error };
};

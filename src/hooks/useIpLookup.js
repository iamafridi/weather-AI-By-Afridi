import { useState, useEffect } from 'react';
import { fetchIpLookup } from '../services/api';
import { useWeatherContext } from '../context/WeatherContext';

export const useIpLookup = () => {
  const { state } = useWeatherContext();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.apiKey) return;
    let cancelled = false;
    setLoading(true);
    fetchIpLookup('auto')
      .then(({ data }) => { if (!cancelled) setInfo(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [state.apiKey]);

  return { info, loading };
};

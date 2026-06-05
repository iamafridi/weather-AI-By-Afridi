import { useCallback } from 'react';
import { useWeatherContext } from '../context/useWeatherContext';
import { fetchUsage } from '../services/api';

export const useUsage = () => {
  const { state, dispatch, toast } = useWeatherContext();

  const loadUsage = useCallback(async () => {
    if (!state.apiKey) return;
    dispatch({ type: 'USAGE_LOADING' });
    try {
      const { data } = await fetchUsage();
      dispatch({ type: 'USAGE_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'USAGE_ERROR', payload: err.message });
      if (err.status !== 401) toast(err.message, 'error');
    }
  }, [state.apiKey, dispatch, toast]);

  return {
    usage:        state.usage,
    usageLoading: state.usageLoading,
    usageError:   state.usageError,
    loadUsage,
  };
};

import { useCallback, useRef } from 'react';
import { useWeatherContext } from '../context/useWeatherContext';
import { fetchWeatherByCoords, fetchWeatherByCity } from '../services/api';
import { fetchHourly } from '../services/api';
import { addRecentSearch } from '../utils/searchHistory';

const resolveName = (data, fallback) => {
  const raw = data?.location ?? data?.city ?? data?.name ?? fallback;
  return typeof raw === 'string' ? raw : fallback;
};

export const useWeather = () => {
  const { state, dispatch, toast } = useWeatherContext();
  const abortRef = useRef(null);

  const searchByCity = useCallback(async (city) => {
    if (!city.trim()) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'WEATHER_LOADING' });
    try {
      const { data, meta } = await fetchWeatherByCity(city.trim(), 7, controller.signal);
      addRecentSearch(city.trim());
      dispatch({
        type: 'WEATHER_SUCCESS',
        payload: {
          data,
          meta,
          location: {
            name: resolveName(data, city),
            lat:  data?.lat,
            lon:  data?.lon,
          },
        },
      });
      if (data?.lat && data?.lon) {
        fetchHourlyData(data.lat, data.lon, dispatch);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      dispatch({ type: 'WEATHER_ERROR', payload: err.message });
      toast(err.message, 'error');
    }
  }, [dispatch, toast]);

  const searchByCoords = useCallback(async (lat, lon, name = '') => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'WEATHER_LOADING' });
    try {
      const { data, meta } = await fetchWeatherByCoords(lat, lon, 7, controller.signal);
      const locationName = resolveName(data, name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      addRecentSearch(locationName);
      dispatch({
        type: 'WEATHER_SUCCESS',
        payload: {
          data,
          meta,
          location: {
            name: locationName,
            lat,
            lon,
          },
        },
      });
      fetchHourlyData(lat, lon, dispatch);
    } catch (err) {
      if (err.name === 'AbortError') return;
      dispatch({ type: 'WEATHER_ERROR', payload: err.message });
      toast(err.message, 'error');
    }
  }, [dispatch, toast]);

  return {
    weather:  state.weather,
    location: state.location,
    loading:  state.loading,
    error:    state.error,
    searchByCity,
    searchByCoords,
  };
};

// Internal helper to load hourly alongside weather
const fetchHourlyData = async (lat, lon, dispatch) => {
  dispatch({ type: 'HOURLY_LOADING' });
  try {
    const { data } = await fetchHourly(lat, lon);
    dispatch({ type: 'HOURLY_SUCCESS', payload: data });
  } catch {
    dispatch({ type: 'HOURLY_ERROR', payload: 'Could not load hourly data.' });
  }
};

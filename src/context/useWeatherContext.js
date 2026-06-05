import { useContext } from 'react';
import { WeatherContext } from './WeatherContext';

export const useWeatherContext = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
};

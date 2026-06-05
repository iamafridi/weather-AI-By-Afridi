import { useState, useCallback } from 'react';
import { useWeatherContext } from '../context/useWeatherContext';

export const useGeolocation = () => {
  const { toast } = useWeatherContext();
  const [locating, setLocating] = useState(false);

  const locate = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by your browser.';
        toast(msg, 'error');
        reject(new Error(msg));
        return;
      }

      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          setLocating(false);
          const msg =
            err.code === 1
              ? 'Location access denied. Please allow location in your browser.'
              : 'Could not determine your location. Try searching by city.';
          toast(msg, 'warning');
          reject(new Error(msg));
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    });
  }, [toast]);

  return { locate, locating };
};

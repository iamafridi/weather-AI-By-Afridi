import { createContext, useContext, useReducer, useCallback } from 'react';
import { getKey, setKey as persistKey, getUnits, setUnits as persistUnits } from '../services/api';

// ─── Initial state ─────────────────────────────────────────────
const initialState = {
  // API key
  apiKey: getKey(),
  units:  getUnits(),

  // Rate limit metadata from last response
  rateLimit: { limit: null, remaining: null, reset: null },

  // Weather search result
  weather:   null,
  location:  null,   // { name, lat, lon }
  loading:   false,
  error:     null,

  // Hourly data
  hourly:        null,
  hourlyLoading: false,
  hourlyError:   null,

  // Usage data
  usage:        null,
  usageLoading: false,
  usageError:   null,

  // Toasts
  toasts: [],
};

// ─── Reducer ───────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_UNITS':
      return { ...state, units: action.payload };
    case 'SET_RATE_LIMIT':
      return { ...state, rateLimit: action.payload };

    case 'WEATHER_LOADING':
      return { ...state, loading: true, error: null };
    case 'WEATHER_SUCCESS':
      return {
        ...state,
        loading:  false,
        weather:  action.payload.data,
        location: action.payload.location,
        rateLimit: action.payload.meta
          ? { limit: action.payload.meta.limit, remaining: action.payload.meta.remaining, reset: action.payload.meta.reset }
          : state.rateLimit,
      };
    case 'WEATHER_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'HOURLY_LOADING':
      return { ...state, hourlyLoading: true, hourlyError: null };
    case 'HOURLY_SUCCESS':
      return { ...state, hourlyLoading: false, hourly: action.payload };
    case 'HOURLY_ERROR':
      return { ...state, hourlyLoading: false, hourlyError: action.payload };

    case 'USAGE_LOADING':
      return { ...state, usageLoading: true, usageError: null };
    case 'USAGE_SUCCESS':
      return { ...state, usageLoading: false, usage: action.payload };
    case 'USAGE_ERROR':
      return { ...state, usageLoading: false, usageError: action.payload };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────
const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Save API key to localStorage + state
  const saveKey = useCallback((key) => {
    persistKey(key);
    dispatch({ type: 'SET_KEY', payload: key });
  }, []);

  // Save units preference
  const saveUnits = useCallback((units) => {
    persistUnits(units);
    dispatch({ type: 'SET_UNITS', payload: units });
  }, []);

  // Toast helpers
  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4500);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  return (
    <WeatherContext.Provider
      value={{ state, dispatch, saveKey, saveUnits, toast, removeToast }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
};

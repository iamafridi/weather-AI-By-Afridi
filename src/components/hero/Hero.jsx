import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Zap, Clock, X } from 'lucide-react';
import { heroEntrance } from '../../utils/animations';
import { useWeather } from '../../hooks/useWeather';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getRecentSearches, clearRecentSearches } from '../../utils/searchHistory';
import IpInfo from './IpInfo';

const QUICK_CITIES = ['Nairobi', 'London', 'New York', 'Tokyo', 'Dubai', 'Sydney'];

export default function Hero() {
  const [query, setQuery]       = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());
  const headlineRef = useRef(null);
  const searchRef   = useRef(null);
  const tagsRef     = useRef(null);
  const { searchByCity, searchByCoords, loading } = useWeather();
  const { locate, locating }    = useGeolocation();

  // GSAP entrance on mount
  useEffect(() => {
    const tl = heroEntrance([headlineRef.current, searchRef.current, tagsRef.current], { stagger: 0.12, y: 50, duration: 0.8 });
    return () => tl.kill();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchByCity(query.trim());
      setQuery('');
      setShowHistory(false);
      setRecentSearches(getRecentSearches());
    }
  };

  const handleHistoryClick = (city) => {
    searchByCity(city);
    setQuery('');
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
    setShowHistory(false);
  };

  const handleFocus = () => {
    if (recentSearches.length > 0) setShowHistory(true);
  };

  const handleGPS = async () => {
    try {
      const { lat, lon } = await locate();
      await searchByCoords(lat, lon);
      setRecentSearches(getRecentSearches());
    } catch { /* toast handled in hook */ }
  };

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-radial-accent opacity-60" />
      <div className="pointer-events-none absolute top-10 right-0 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1300px] mx-auto px-6">
        {/* Eyebrow */}
        <div ref={headlineRef} className="opacity-0">
          <p className="eyebrow mb-4">Real-time Weather Intelligence</p>
          <h1 className="text-[clamp(40px,6vw,72px)] font-black leading-[1.05] tracking-[-0.04em] text-white mb-5">
            Weather at the<br />
            <span className="gradient-text">Speed of AI</span>
          </h1>
          <p className="text-wtext2 text-[16px] max-w-[500px] leading-relaxed mb-10">
            Search any city or use GPS for instant AI-powered weather insights,
            7-day forecasts, and agricultural tree analysis.
          </p>
        </div>

        {/* Search bar */}
        <div ref={searchRef} className="opacity-0 relative">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-bg3/70 border border-white/[0.08] backdrop-blur-md rounded-xl p-1.5 max-w-[620px] focus-within:border-accent/40 focus-within:shadow-glow transition-all duration-300">
            <Search size={16} className="text-muted ml-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder="Search city… e.g. Nairobi, London, Tokyo"
              className="flex-1 bg-transparent text-wtext text-[15px] outline-none placeholder:text-muted min-w-0 py-1.5"
            />
            <button
              type="button"
              onClick={handleGPS}
              disabled={locating}
              className="flex items-center gap-1.5 bg-bg4 border border-white/10 rounded-lg text-wtext2 text-[12px] font-semibold px-3 py-2 hover:border-accent hover:text-accent transition-all disabled:opacity-50 flex-shrink-0"
            >
              <MapPin size={13} className={locating ? 'animate-pulse' : ''} />
              <span className="hidden sm:inline">{locating ? 'Locating…' : 'GPS'}</span>
            </button>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-accent text-bg font-bold text-[13px] px-5 py-2 rounded-lg hover:opacity-85 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-bg/20 border-t-bg rounded-full animate-spin-slow" />
                  Searching
                </span>
              ) : 'Search'}
            </button>
          </form>

          {/* Recent searches dropdown */}
          {showHistory && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-w-[620px] glass border border-white/[0.08] rounded-xl py-2 shadow-glass z-50">
              <div className="flex items-center justify-between px-4 py-1.5">
                <span className="font-mono text-[9px] text-muted tracking-wider uppercase flex items-center gap-1.5">
                  <Clock size={10} /> Recent
                </span>
                <button
                  onClick={handleClearHistory}
                  className="font-mono text-[9px] text-muted2 hover:text-wred transition-colors flex items-center gap-1"
                >
                  <X size={10} /> Clear
                </button>
              </div>
              {recentSearches.map((city) => (
                <button
                  key={city}
                  onMouseDown={() => handleHistoryClick(city)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-wtext2 hover:bg-accent/5 hover:text-wtext transition-colors text-left"
                >
                  <Clock size={12} className="text-muted2 flex-shrink-0" />
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick tags */}
        <div ref={tagsRef} className="opacity-0 flex flex-wrap gap-2 mt-5">
          {QUICK_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => { setQuery(city); searchByCity(city); }}
              className="flex items-center gap-1.5 bg-bg3 border border-white/[0.08] rounded-full text-wtext2 text-[12px] px-3.5 py-1.5 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
            >
              <Zap size={10} className="text-accent" />
              {city}
            </button>
          ))}
        </div>

        {/* IP-detected location */}
        <IpInfo />
      </div>
    </section>
  );
}

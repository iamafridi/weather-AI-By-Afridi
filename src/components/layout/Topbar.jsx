import { useState, useRef, useEffect } from 'react';
import { Key, Eye, EyeOff, Activity } from 'lucide-react';
import { useWeatherContext } from '../../context/useWeatherContext';
import { useUsage } from '../../hooks/useUsage';

export default function Topbar() {
  const { state, saveKey, toast } = useWeatherContext();
  const { loadUsage } = useUsage();
  const [show, setShow]   = useState(false);
  const [draft, setDraft] = useState(state.apiKey);
  const inputRef = useRef(null);

  // Load usage whenever key changes
  useEffect(() => { loadUsage(); }, [state.apiKey]); // eslint-disable-line

  const handleSave = () => {
    if (!draft.trim()) return;
    saveKey(draft.trim());
    toast('API key saved ✓', 'success');
    loadUsage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const { limit, remaining } = state.rateLimit;

  return (
    <header className="sticky top-0 z-[200] bg-bg/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-[1300px] mx-auto px-6 h-[60px] flex items-center gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
          <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2af5c8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#lg)" />
            <path d="M18 4L9 18h8l-3 10L24 14h-8L18 4Z" fill="#03060f" strokeLinejoin="round" />
          </svg>
          <span className="text-[17px] font-extrabold tracking-tight text-white">
            Weather<span className="text-accent">AI</span>
          </span>
          <span className="plan-badge-free hidden sm:inline-block">Dashboard</span>
        </a>

        <div className="flex-1" />

        {/* Rate limit pill */}
        {limit && (
          <div className="hidden md:flex items-center gap-1.5 bg-bg3 border border-white/10 rounded-full px-3 py-1">
            <Activity size={11} className="text-accent" />
            <span className="font-mono text-[11px] text-muted">Quota</span>
            <span className="font-mono text-[11px] text-accent font-semibold">{remaining}</span>
            <span className="font-mono text-[11px] text-muted2">/</span>
            <span className="font-mono text-[11px] text-muted">{limit}</span>
          </div>
        )}

        {/* API key input */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:block text-[11px] text-muted font-mono whitespace-nowrap">
            <Key size={10} className="inline mr-1" />API Key
          </span>
          <div className="relative">
            <input
              ref={inputRef}
              type={show ? 'text' : 'password'}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="wai_your_key_here"
              className={`wai-input w-[190px] sm:w-[220px] pr-8 ${draft ? 'border-wgreen/40' : ''}`}
            />
            <button
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-wtext transition-colors"
            >
              {show ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          <button
            onClick={handleSave}
            className="bg-accent text-bg font-bold text-[12px] px-3.5 py-[7px] rounded-lg hover:opacity-85 active:scale-95 transition-all whitespace-nowrap"
          >
            Save
          </button>
        </div>
      </div>
    </header>
  );
}

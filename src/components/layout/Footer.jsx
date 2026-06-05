export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-16">
      <div className="max-w-[1300px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-muted">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2af5c8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#flg)" />
            <path d="M18 4L9 18h8l-3 10L24 14h-8L18 4Z" fill="#03060f" />
          </svg>
          <span>
            Built with{' '}
            <a
              href="https://weather-ai.co/docs"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              WeatherAI API
            </a>
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://weather-ai.co/docs" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            Docs
          </a>
          <a href="https://weather-ai.co" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            Dashboard
          </a>
          <span className="text-muted2">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

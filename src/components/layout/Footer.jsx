export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-16">
      <div className="max-w-[1300px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-muted">
        <span>
          Built by{' '}
          <a
            href="https://iamafrididev.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline font-medium"
          >
            Afridi Akbar Ifty
          </a>
          {' '}with{' '}
          <a
            href="https://weather-ai.co/docs"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            WeatherAI API
          </a>
        </span>
        <div className="flex items-center gap-5">
          <a href="https://weather-ai.co/docs" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            Docs
          </a>
          <a href="https://iamafrididev.netlify.app" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            Portfolio
          </a>
          <span className="text-muted2">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

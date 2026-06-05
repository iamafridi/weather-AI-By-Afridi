# WeatherAI Dashboard

An AI-powered weather intelligence dashboard that consumes the [WeatherAI API](https://weather-ai.co/docs) to deliver real-time weather data, Gemini AI summaries, 7-day forecasts, hourly temperature charts, and agroforestry tree analysis from drone/satellite imagery.

## Features

### 🌤️ Weather Intelligence
- **Current Conditions** — Temperature, humidity, wind speed/direction, UV index, pressure
- **Gemini AI Summary** — AI-generated weather briefings with natural language insights
- **7-Day Forecast** — Daily high/low temperatures with precipitation probability
- **24-Hour Temperature Chart** — Interactive area chart (temp + rain %) using Recharts
- **Mini Stats Grid** — Visibility, sunrise/sunset, dew point

### 🌳 Agroforestry Analysis
- **Tree Crown Detection** — Upload drone/aerial/satellite images for automated tree counting
- **Canopy Health Scoring** — AI-powered health breakdown (healthy / needs care / needs replanting)
- **Species Detection** — Gemini-assisted tree species identification
- **Agronomic Recommendations** — Actionable insights powered by OpenCV + Gemini

### 📊 API Usage & Quota
- **Usage Dashboard** — Real-time API and AI request consumption with donut charts
- **Billing Period** — Current plan, period start/end, upgrade link
- **Rate Limit Display** — Live remaining quota in topbar

### 📋 Pricing
- **Free** — 1K req/mo, 5 tree analyses
- **Pro ($29/mo)** — 50K req/mo, 100 tree analyses, webhooks
- **Scale ($149/mo)** — 500K req/mo, unlimited tree analyses, SMS/USSD

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion + GSAP |
| Charts | Recharts |
| Icons | Lucide React |
| API | WeatherAI API v1 |
| Deployment | Netlify |

## API Integration

This project integrates the following [WeatherAI API](https://weather-ai.co/docs) endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /v1/weather` | Current conditions + multi-day forecast with AI summary |
| `GET /v1/weather-geo` | Weather by city name with IP auto-detection |
| `GET /v1/current` | Current conditions only |
| `GET /v1/hourly` | Hourly forecast breakdown |
| `GET /v1/daily` | Daily forecast summary |
| `GET /v1/usage` | Account usage and quota |
| `POST /v1/trees/analyze` | Tree crown and canopy analysis from images |
| `GET /v1/trees/history` | Past tree analysis results |
| `GET /v1/trees/quota` | Remaining tree analysis quota |
| `GET /v1/ip-lookup` | IP address to geo-coordinates resolution |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A WeatherAI API key (generate from [WeatherAI Dashboard](https://weather-ai.co))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd weather-ai-by-afridi

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your API configuration if needed

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.weather-ai.co/v1` | WeatherAI API base URL |
| `VITE_APP_TITLE` | `WeatherAI Dashboard` | Browser tab title |

### Using the App

1. **Enter your API key** — Click the key input in the top-right corner, paste your `wai_` key, and click Save.
2. **Search a city** — Type a city name in the search bar and hit Enter (or click Search), or use the GPS button for your current location.
3. **Explore weather data** — View current conditions, AI summary, 7-day forecast, and hourly chart.
4. **Analyze a farm image** — Scroll to the Agroforestry section, upload a drone/satellite image, fill in optional details, and click Analyze Farm.

## Deployment

This project is deployed on Netlify:

[![Netlify Status](https://api.netlify.com/api/v1/badges/<badge-id>/deploy-status)](<deploy-url>)

### Deploy Your Own

```bash
# Build for production
npm run build

# The output in ./dist can be deployed to any static host:
# Netlify, Vercel, Render, Firebase Hosting, etc.
```

## Build Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Root layout + weather dashboard
├── index.css                 # Tailwind + custom styles
├── context/
│   └── WeatherContext.jsx     # Global state (useReducer)
├── hooks/
│   ├── useWeather.js          # Weather search logic
│   ├── useGeolocation.js      # Browser GPS
│   └── useUsage.js            # API usage fetching
├── services/
│   └── api.js                 # WeatherAI API client
├── components/
│   ├── layout/                # Topbar, Footer
│   ├── hero/                  # Hero + search
│   ├── weather/               # CurrentCard, AISummaryCard, ForecastStrip, HourlyChart, StatsMiniGrid
│   ├── agro/                  # AgroSection, AgroResults
│   ├── usage/                 # UsageSection
│   ├── plans/                 # PlansSection
│   └── ui/                    # DonutChart, Skeleton, Toast, ErrorBoundary
└── utils/
    ├── animations.js          # GSAP animations
    ├── formatters.js          # Display formatters
    └── weatherIcons.js        # WMO code → emoji mapping
```

## What's Next

- [ ] TypeScript migration for type-safe API interactions
- [ ] Unit + integration tests (Vitest + React Testing Library)
- [ ] Search history with recent locations
- [ ] PWA support with offline fallback
- [ ] Dark/light theme toggle
- [ ] Language selector (Swahili, French, etc.)
- [ ] Webhook management UI

## License

MIT

---

Built with the [WeatherAI API](https://weather-ai.co/docs).

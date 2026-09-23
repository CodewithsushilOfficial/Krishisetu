import React, { useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import useWeather from '../../../hooks/useWeather.js';
import { useWeatherStore } from '../../../stores/weatherStore.js';
import { getWeatherIcon } from '../../../components/weather/WeatherCard.jsx';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  MapPin,
  RotateCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Compass,
} from 'lucide-react';

export function WeatherPage() {
  useEffect(() => {
    document.title = 'Weather & Microclimate | KrishiSetu';
  }, []);

  const { weather, isLoading, isFetching, isError, error, refetch } = useWeather();
  const openSearchModal = useWeatherStore((state) => state.openSearchModal);
  const requestBrowserLocation = useWeatherStore((state) => state.requestBrowserLocation);
  const isLoadingLocation = useWeatherStore((state) => state.isLoadingLocation);

  const current = weather?.current || {};
  const currentTemp = current.temperature ?? 30;
  const condition = current.condition || 'Partly Cloudy';
  const humidity = current.humidity ? `${current.humidity}%` : '65%';
  const rainProb = weather?.daily?.[0]?.rainProbability ?? weather?.hourly?.[0]?.rainProbability ?? 20;
  const windSpeed = current.windSpeed ?? 12;
  const windDirection = current.windDirection ?? 0;
  const uvIndex = current.uvIndex ?? 0;
  const locationFormatted = weather?.location?.formatted || 'Current Farm Location';
  const alerts = weather?.alerts || [];
  const hourly = weather?.hourly || [];
  const daily = weather?.daily || [];
  const advisories = weather?.insights || [];

  return (
    <DashboardLayout
      title="Weather & Agricultural Microclimate"
      subtitle="Hyperlocal agricultural telemetry, precipitation radars, and field operation advisories"
      fullWidth={true}
    >
      <div className="space-y-6 pb-12">
        {/* Top Microclimate Banner */}
        <div className="bg-gradient-to-br from-[#1b6b93] via-[#104e70] to-[#0a354c] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
            <CloudRain className="h-64 w-64" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              {/* Location pill and quick actions */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-sky-200 font-bold mb-2">
                <button
                  onClick={openSearchModal}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer border border-white/15"
                >
                  <MapPin className="h-3.5 w-3.5 text-sky-300" />
                  <span>{locationFormatted}</span>
                  <Search className="h-3 w-3 text-sky-300 ml-1 opacity-70" />
                </button>

                <button
                  onClick={requestBrowserLocation}
                  disabled={isLoadingLocation}
                  className="flex items-center gap-1 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer border border-emerald-400/20"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isLoadingLocation ? 'Locating...' : 'Use GPS'}</span>
                </button>

                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
                  title="Refresh weather"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Temperature & Condition */}
              <div className="flex items-baseline gap-4 mt-2">
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight">{currentTemp}°C</h1>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-sky-100">{condition}</span>
                  <div className="text-xs text-sky-300 font-medium mt-0.5">
                    Feels like {current.feelsLike ?? currentTemp}°C {uvIndex > 0 ? `• UV Index ${uvIndex}` : ''}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-sky-200 mt-3 max-w-xl font-medium leading-relaxed">
                Live microclimate telemetry from Open-Meteo. Coordinates: {weather?.location?.latitude?.toFixed(4) ?? '--'}°N, {weather?.location?.longitude?.toFixed(4) ?? '--'}°E.
              </p>
            </div>

            {/* Metrics Cluster */}
            <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/15 shrink-0">
              <div className="text-center">
                <Droplets className="h-5 w-5 text-sky-300 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-sky-200 block uppercase tracking-wider">
                  Humidity
                </span>
                <span className="text-base sm:text-lg font-black">{humidity}</span>
              </div>
              <div className="text-center border-x border-white/15 px-3">
                <CloudRain className="h-5 w-5 text-sky-300 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-sky-200 block uppercase tracking-wider">
                  Rain Chance
                </span>
                <span className="text-base sm:text-lg font-black">{rainProb}%</span>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 text-sky-300 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-sky-200 block uppercase tracking-wider">
                  Wind Speed
                </span>
                <span className="text-base sm:text-lg font-black">{windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Severe Weather Alerts (if any) */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((al, idx) => (
              <div
                key={al.id || idx}
                className="p-4 rounded-3xl bg-red-50 border border-red-200 flex items-start gap-3.5 text-red-900 shadow-2xs"
              >
                <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-red-700">
                    {al.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-red-600 mt-1 font-medium leading-relaxed">
                    {al.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 24-Hour Hourly Forecast Horizon */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-black text-slate-900">
              Next 24 Hours Microclimate Horizon
            </h2>
            <span className="text-xs font-semibold text-stone-400">Hourly Telemetry</span>
          </div>

          {isLoading && !weather ? (
            <div className="flex gap-3 overflow-x-auto py-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-32 w-24 bg-stone-100 rounded-2xl shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-stone-200">
              {hourly.map((h, idx) => (
                <div
                  key={idx}
                  className={`shrink-0 p-3.5 rounded-2xl text-center border transition-all min-w-[85px] ${
                    idx === 0
                      ? 'bg-emerald-50 border-emerald-200 shadow-2xs'
                      : 'bg-stone-50/70 border-stone-200/70'
                  }`}
                >
                  <span className="text-xs font-bold text-stone-600 block">
                    {idx === 0 ? 'Now' : h.displayTime}
                  </span>
                  <div className="my-2 flex justify-center">
                    {getWeatherIcon(h.icon, 'w-6 h-6')}
                  </div>
                  <div className="text-sm font-black text-slate-900">{h.temperature}°C</div>
                  <span className="text-[11px] font-bold text-sky-600 block mt-1">
                    {h.rainProbability}% rain
                  </span>
                  {h.rain > 0 && (
                    <span className="text-[10px] text-stone-400 font-medium block">
                      {h.rain} mm
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7-Day Forecast Horizon */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-black text-slate-900">
              7-Day Agricultural Forecast Horizon
            </h2>
            <span className="text-xs font-semibold text-stone-400">Daily Projections</span>
          </div>

          {isLoading && !weather ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-32 bg-stone-100 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
              {daily.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-center border transition-all ${
                    idx === 0
                      ? 'bg-emerald-50 border-emerald-200 shadow-2xs'
                      : 'bg-stone-50/70 border-stone-200/60'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800 block">{f.day}</span>
                  <div className="my-2 flex justify-center">
                    {getWeatherIcon(f.icon, 'w-6 h-6')}
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {f.maxTemp}° <span className="text-xs text-stone-400 font-normal">{f.minTemp}°</span>
                  </div>
                  <span className="text-[11px] font-bold text-sky-600 block mt-1">
                    {f.rainProbability}% rain
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium block truncate mt-0.5">
                    {f.condition}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agronomic Field Operations Guidance */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Field Operations Advisory</h2>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                Actionable microclimate guidelines for irrigation, spraying, and harvest storage
              </p>
            </div>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
              Deterministic Guidance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {advisories.map((adv, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#107c41]">
                    {adv.type}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">
                    {adv.severity || 'INFO'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 pt-0.5">{adv.title}</h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <span className="italic">
              *Informational guidance only. Cross-verify with local Krishi Vigyan Kendra (KVK) guidelines.
            </span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Weather data by Open-Meteo (CC BY 4.0)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WeatherPage;

import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Snowflake,
  Wind,
  Droplets,
  RotateCw,
  MapPin,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Calendar,
} from 'lucide-react';
import { useWeatherStore } from '../../stores/weatherStore.js';
import useWeather from '../../hooks/useWeather.js';

// Weather icon mapper
export function getWeatherIcon(iconName, className = 'w-6 h-6') {
  switch (iconName) {
    case 'sun':
      return <Sun className={`${className} text-amber-500`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-500`} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-sky-400`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-sky-600`} />;
    case 'cloud-rain-heavy':
      return <CloudRain className={`${className} text-blue-700`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-purple-600`} />;
    case 'cloud-snow':
      return <Snowflake className={`${className} text-cyan-400`} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    default:
      return <CloudSun className={`${className} text-amber-500`} />;
  }
}

export function WeatherCard({
  overrideLat = null,
  overrideLon = null,
  overrideName = null,
  compact = false,
  showHourly = true,
  showDaily = true,
  showInsights = true,
}) {
  const {
    weather,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    location,
    permissionState,
    requestBrowserLocation,
  } = useWeather(overrideLat, overrideLon, overrideName);

  const openSearchModal = useWeatherStore((state) => state.openSearchModal);
  const openPermissionModal = useWeatherStore((state) => state.openPermissionModal);

  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' | 'daily' | 'insights'

  // Loading skeleton state
  if (isLoading && !weather) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs animate-pulse">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="h-6 w-32 bg-stone-200 rounded-lg" />
          <div className="h-5 w-24 bg-stone-200 rounded-full" />
        </div>
        <div className="my-5 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 w-24 bg-stone-200 rounded-xl" />
            <div className="h-4 w-32 bg-stone-200 rounded-lg" />
          </div>
          <div className="h-16 w-16 bg-stone-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100">
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError && !weather) {
    return (
      <div className="bg-white rounded-3xl border border-red-200 p-6 shadow-xs text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-900">Weather Telemetry Unavailable</h4>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          {error?.message || 'Could not connect to meteorological satellite feed.'}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Retry
          </button>
          <button
            onClick={openSearchModal}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Search Location
          </button>
        </div>
      </div>
    );
  }

  const current = weather?.current || {};
  const locationInfo = weather?.location || location;
  const alerts = weather?.alerts || [];
  const insights = weather?.insights || [];
  const hourly = weather?.hourly || [];
  const daily = weather?.daily || [];

  return (
    <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 overflow-hidden flex flex-col justify-between">
      {/* 1. Header: Title, Location selector, Refresh button */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌤️</span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Weather</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Clickable Location Pill */}
            <button
              onClick={openSearchModal}
              title="Click to change location"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/60 transition-colors cursor-pointer max-w-[170px] sm:max-w-xs truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{locationInfo?.formatted || 'Local Farm'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh live weather"
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Permission Notice Banner (if denied) */}
        {permissionState === 'denied' && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Location access disabled. Showing selected location.</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={openPermissionModal}
                className="font-bold underline hover:text-amber-950 cursor-pointer text-[11px]"
              >
                Enable
              </button>
              <span>•</span>
              <button
                onClick={openSearchModal}
                className="font-bold underline hover:text-amber-950 cursor-pointer text-[11px]"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Severe Weather Alert Banner */}
        {alerts.length > 0 && (
          <div className="mt-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-black uppercase tracking-wider text-red-700">
                {alerts[0].title}
              </div>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed font-medium">
                {alerts[0].message}
              </p>
            </div>
          </div>
        )}

        {/* 2. Main Weather Display */}
        <div className="my-4 flex items-center justify-between px-1">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {current.temperature ?? '--'}°C
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Feels like {current.feelsLike ?? current.temperature}°C
              </span>
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
              <span>{current.condition || 'Partly Cloudy'}</span>
              {current.uvIndex > 0 && (
                <span className="text-stone-400 font-normal">• UV {current.uvIndex}</span>
              )}
            </div>
          </div>

          {/* Condition Icon */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            {getWeatherIcon(current.conditionIcon, 'w-10 h-10 sm:w-12 sm:h-12')}
          </div>
        </div>

        {/* 3. Metric Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50/80 rounded-2xl border border-stone-100 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-600 text-xs font-medium">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>Humidity</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-0.5">
              {current.humidity ?? '--'}%
            </div>
          </div>

          <div className="border-x border-stone-200/80">
            <div className="flex items-center justify-center gap-1 text-slate-600 text-xs font-medium">
              <Wind className="w-3.5 h-3.5 text-teal-600" />
              <span>Wind</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-0.5">
              {current.windSpeed ?? '--'} km/h
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-slate-600 text-xs font-medium">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              <span>Rain Chance</span>
            </div>
            <div className="text-sm font-black text-slate-900 mt-0.5">
              {daily[0]?.rainProbability ?? hourly[0]?.rainProbability ?? 0}%
            </div>
          </div>
        </div>

        {/* 4. Tabbed Hourly / Daily / Insights Horizon (if not compact) */}
        {!compact && (
          <div className="mt-5 pt-4 border-t border-stone-100">
            {/* Tab Header */}
            <div className="flex items-center gap-2 mb-3">
              {showHourly && (
                <button
                  onClick={() => setActiveTab('hourly')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'hourly'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Hourly
                </button>
              )}
              {showDaily && (
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'daily'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  7-Day
                </button>
              )}
              {showInsights && (
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'insights'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Agronomic Guidance
                </button>
              )}
            </div>

            {/* Hourly Horizon Slider */}
            {activeTab === 'hourly' && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-200">
                {hourly.slice(0, 16).map((h, i) => (
                  <div
                    key={i}
                    className={`shrink-0 p-2.5 rounded-2xl text-center border min-w-[68px] ${
                      i === 0
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-stone-50/60 border-stone-200/60'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-stone-600">
                      {i === 0 ? 'Now' : h.displayTime}
                    </div>
                    <div className="my-1.5 flex justify-center">
                      {getWeatherIcon(h.icon, 'w-5 h-5')}
                    </div>
                    <div className="text-xs font-black text-slate-900">{h.temperature}°</div>
                    <div className="text-[10px] text-sky-600 font-bold mt-0.5">
                      {h.rainProbability}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7-Day Forecast */}
            {activeTab === 'daily' && (
              <div className="space-y-1.5">
                {daily.map((d, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-2xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-[90px]">
                      {getWeatherIcon(d.icon, 'w-4 h-4')}
                      <span className="font-bold text-slate-800">{d.day}</span>
                    </div>
                    <span className="text-stone-500 font-medium text-[11px] truncate max-w-[110px]">
                      {d.condition}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-sky-600 font-bold">
                        {d.rainProbability}% rain
                      </span>
                      <div className="text-right font-black text-slate-900">
                        {d.maxTemp}° <span className="text-stone-400 font-normal">{d.minTemp}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Agronomic Guidance */}
            {activeTab === 'insights' && (
              <div className="space-y-2">
                {insights.length === 0 ? (
                  <div className="text-xs text-stone-500 py-3 text-center">
                    Microclimate conditions are optimal for normal field operations.
                  </div>
                ) : (
                  insights.map((ins, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ins.title}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-stone-600 leading-relaxed font-medium">
                        {ins.description}
                      </p>
                    </div>
                  ))
                )}
                <div className="text-[10px] text-stone-400 italic pt-1">
                  *Agronomic insights are deterministic guidance based on microclimate forecasts.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Footer: Attribution & Last updated */}
      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emerald-700 hover:underline flex items-center gap-1 font-medium"
        >
          <span>Weather data by Open-Meteo</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <span>Updated 5 min ago</span>
      </div>
    </div>
  );
}

export default WeatherCard;

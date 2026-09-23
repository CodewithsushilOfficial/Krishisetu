import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  RotateCw,
  Droplets,
  Wind,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import useWeather from '../../../hooks/useWeather.js';
import { useWeatherStore } from '../../../stores/weatherStore.js';
import { getWeatherIcon } from '../../../components/weather/WeatherCard.jsx';

export default function WeatherWidget({ weather: initialWeather }) {
  const navigate = useNavigate();
  const { weather: liveWeather, isLoading, isFetching, refetch } = useWeather();
  const openSearchModal = useWeatherStore((state) => state.openSearchModal);

  // Blend live weather with initial weather fallback
  const weather = liveWeather || initialWeather;

  const current = weather?.current || {};
  const locationName =
    weather?.location?.formatted ||
    (typeof weather?.location === 'string' ? weather.location : 'Local Farm');
  const temp = current.temperature ?? weather?.temperature ?? 30;
  const condition = current.condition || weather?.condition || 'Partly Cloudy';
  const conditionIcon = current.conditionIcon || 'cloud-sun';
  const rainChance =
    weather?.daily?.[0]?.rainProbability ??
    weather?.hourly?.[0]?.rainProbability ??
    weather?.rainProbability ??
    20;
  const humidity = current.humidity ?? parseInt(weather?.humidity) ?? 65;
  const windSpeed = current.windSpeed ?? weather?.windSpeedKmH ?? 12;

  const activeAlert =
    weather?.alerts?.[0] ||
    weather?.alert || {
      severity: 'NORMAL',
      title: 'Microclimate Stable',
      message: 'No severe weather alerts detected for current agricultural zones.',
    };

  const isSevereAlert =
    activeAlert?.severity === 'HIGH' ||
    activeAlert?.title?.toLowerCase().includes('alert') ||
    activeAlert?.title?.toLowerCase().includes('warning');

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🌤️</span>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Weather & Alerts
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clickable Location */}
            <button
              onClick={openSearchModal}
              title="Change weather location"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200/60 transition-colors cursor-pointer max-w-[130px] truncate"
            >
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{locationName}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh weather"
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Weather Metric & Condition */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-stone-50 rounded-xl border border-stone-100">
              {getWeatherIcon(conditionIcon, 'w-7 h-7')}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {temp}°C
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {condition}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="text-right flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-stone-500 font-semibold flex items-center justify-end gap-1">
                <CloudRain className="w-3 h-3 text-sky-600" />
                <span>Rain</span>
              </div>
              <div className="text-xs font-black text-slate-900 leading-tight">
                {rainChance}%
              </div>
            </div>
            <div className="text-right border-l border-stone-200 pl-2.5">
              <div className="text-[10px] text-stone-500 font-semibold flex items-center justify-end gap-1">
                <Droplets className="w-3 h-3 text-sky-500" />
                <span>Humidity</span>
              </div>
              <div className="text-xs font-black text-slate-900 leading-tight">
                {humidity}%
              </div>
            </div>
          </div>
        </div>

        {/* Precaution / Alert Box */}
        {isSevereAlert ? (
          <div className="mt-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-[11px] font-black uppercase text-red-700 tracking-wider">
                {activeAlert.title}
              </div>
              <p className="text-[11px] text-red-600 font-medium leading-snug mt-0.5">
                {activeAlert.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
            <span className="text-xs">🌱</span>
            <p className="text-[11px] text-emerald-800 font-medium leading-snug">
              Microclimate favorable for ongoing irrigation and field operations.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Footer Link & Open-Meteo Attribution */}
      <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-stone-400 hover:text-emerald-700 hover:underline flex items-center gap-0.5 font-medium"
        >
          <span>Open-Meteo data</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>

        <button
          onClick={() => navigate('/farmer/weather')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
        >
          <span>7-Day Forecast</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

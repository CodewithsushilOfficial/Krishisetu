import React, { useState, useEffect } from 'react';
import {
  Building2,
  Warehouse,
  MapPin,
  CloudRain,
  ShieldAlert,
  RotateCw,
  Plus,
  Navigation,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import useWeather from '../../../hooks/useWeather.js';
import { useWeatherStore } from '../../../stores/weatherStore.js';
import weatherService from '../../../services/weatherService.js';
import { getWeatherIcon } from '../../../components/weather/WeatherCard.jsx';

// Single Location Mini-Card for the Multi-Hub Overview Grid
function HubWeatherCard({ hub, isSelected, onSelect }) {
  const { weather, isLoading, isFetching, refetch } = useWeather(
    hub.latitude,
    hub.longitude,
    hub.name
  );

  const current = weather?.current || {};
  const alert = weather?.alerts?.[0];
  const rainChance =
    weather?.daily?.[0]?.rainProbability ??
    weather?.hourly?.[0]?.rainProbability ??
    20;

  return (
    <div
      onClick={() => onSelect(hub)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
          : 'bg-white hover:bg-stone-50 border-stone-200/80 hover:border-emerald-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            {hub.type || 'Hub'}
          </span>
          <h4 className="text-sm font-black text-slate-900 mt-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{hub.name}</span>
          </h4>
          <p className="text-[11px] text-stone-500 font-medium">
            {hub.district || hub.state || 'Operational Center'}
          </p>
        </div>

        <div className="p-2 bg-stone-50 rounded-xl border border-stone-100">
          {getWeatherIcon(current.conditionIcon || 'cloud-sun', 'w-6 h-6')}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between border-t border-stone-100 pt-2.5">
        <div>
          <span className="text-2xl font-black text-slate-900">
            {isLoading ? '--' : `${current.temperature ?? 30}°C`}
          </span>
          <span className="text-[11px] text-stone-500 ml-1.5 font-medium">
            {current.condition || 'Partly Cloudy'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Rain Risk</span>
          <span
            className={`text-xs font-black ${
              rainChance > 50 ? 'text-red-600 font-extrabold' : 'text-sky-600'
            }`}
          >
            {rainChance}%
          </span>
        </div>
      </div>

      {alert && (
        <div className="mt-2.5 p-1.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-1.5 text-[10px] text-red-700 font-bold">
          <ShieldAlert className="w-3 h-3 text-red-600 shrink-0" />
          <span className="truncate">{alert.title}</span>
        </div>
      )}
    </div>
  );
}

export function FpoMultiLocationWeather({ profile }) {
  const userGpsLocation = useWeatherStore((state) => state.location);
  const openSearchModal = useWeatherStore((state) => state.openSearchModal);

  // Default hubs configured from FPO profile
  const [hubs, setHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);

  // Initialize hubs based on FPO profile and operational areas
  useEffect(() => {
    const fpoDistrict = profile?.district || 'Varanasi';
    const fpoState = profile?.state || 'Uttar Pradesh';

    const initialHubs = [
      {
        id: 'head-office',
        name: `${profile?.fpoName || 'FPO'} Head Office`,
        district: fpoDistrict,
        state: fpoState,
        latitude: 25.3176,
        longitude: 82.9739,
        type: 'Head Office',
      },
      {
        id: 'center-a',
        name: 'Pindra Collection Center',
        district: 'Pindra',
        state: fpoState,
        latitude: 25.4855,
        longitude: 82.8398,
        type: 'Collection Center',
      },
      {
        id: 'center-b',
        name: 'Jaunpur Warehouse Cluster',
        district: 'Jaunpur',
        state: fpoState,
        latitude: 25.7464,
        longitude: 82.6837,
        type: 'Warehouse',
      },
    ];

    // If manager has current GPS location, add it
    if (userGpsLocation?.source === 'gps') {
      initialHubs.push({
        id: 'device-gps',
        name: userGpsLocation.city || 'Manager Device Location',
        district: userGpsLocation.district || '',
        state: userGpsLocation.state || '',
        latitude: userGpsLocation.latitude,
        longitude: userGpsLocation.longitude,
        type: 'Live GPS',
      });
    }

    setHubs(initialHubs);
    setSelectedHub(initialHubs[0]);
  }, [profile, userGpsLocation]);

  // Hook for the currently selected hub
  const {
    weather,
    isLoading,
    isFetching,
    refetch,
  } = useWeather(
    selectedHub?.latitude,
    selectedHub?.longitude,
    selectedHub?.name
  );

  const current = weather?.current || {};
  const alerts = weather?.alerts || [];
  const hourly = weather?.hourly || [];
  const daily = weather?.daily || [];
  const insights = weather?.insights || [];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌤️</span>
            <h3 className="font-extrabold text-base text-stone-900">
              FPO Multi-Hub Microclimate & Logistics Intelligence
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor precipitation, moisture risks, and logistics feasibility across FPO operational centers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={openSearchModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Monitor Hub</span>
          </button>
        </div>
      </div>

      {/* 2. Multi-Location Hub Cards Overview Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          Monitored Centers & Warehouses ({hubs.length})
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hubs.map((hub) => (
            <HubWeatherCard
              key={hub.id}
              hub={hub}
              isSelected={selectedHub?.id === hub.id}
              onSelect={(h) => setSelectedHub(h)}
            />
          ))}
        </div>
      </div>

      {/* 3. Detailed Telemetry for Selected Hub */}
      {selectedHub && (
        <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {selectedHub.type}
                </span>
                <h4 className="text-base font-black text-slate-900">{selectedHub.name}</h4>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Coordinates: {selectedHub.latitude?.toFixed(4)}°N, {selectedHub.longitude?.toFixed(4)}°E
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">
                  {current.temperature ?? 30}°C
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  {current.condition || 'Partly Cloudy'}
                </div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                {getWeatherIcon(current.conditionIcon || 'cloud-sun', 'w-8 h-8')}
              </div>
            </div>
          </div>

          {/* Active Alerts for this Hub */}
          {alerts.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black uppercase text-red-700">{alerts[0].title}: </span>
                <span className="font-medium text-red-700">{alerts[0].message}</span>
              </div>
            </div>
          )}

          {/* Hourly Forecast for this Hub */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Next 12 Hours Forecast
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-200">
              {hourly.slice(0, 12).map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-center min-w-[70px] shrink-0"
                >
                  <span className="text-[10px] font-bold text-stone-500 block">
                    {i === 0 ? 'Now' : h.displayTime}
                  </span>
                  <div className="my-1 flex justify-center">
                    {getWeatherIcon(h.icon, 'w-4 h-4')}
                  </div>
                  <div className="text-xs font-black text-slate-900">{h.temperature}°</div>
                  <span className="text-[10px] font-bold text-sky-600 block">
                    {h.rainProbability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FPO Logistics & Aggregation Guidance */}
          {insights.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                Collective Storage & Dispatch Advisory
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {insights.slice(0, 2).map((ins, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white border border-stone-200/80 text-xs space-y-1"
                  >
                    <div className="font-black text-slate-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{ins.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                      {ins.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Attribution */}
      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emerald-700 hover:underline flex items-center gap-1 font-medium"
        >
          <span>Weather data by Open-Meteo (CC BY 4.0)</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <span>Live FPO Multi-Node Telemetry</span>
      </div>
    </div>
  );
}

export default FpoMultiLocationWeather;

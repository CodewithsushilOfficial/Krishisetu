import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck, Share2, Navigation, Radio, Copy, Check } from 'lucide-react';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Markers
const createVehicleIcon = (plateNumber = 'UP65XX1234') =>
  L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="background: #0d5c3a; color: white; padding: 2px 7px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.25); border: 1.5px solid #ffffff; margin-bottom: 3px;">
          🚚 ${plateNumber}
        </div>
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #0d5c3a; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [85, 54],
    iconAnchor: [42, 50],
  });

const createLocationPin = (label, color = '#107c41', isPickup = true) =>
  L.divIcon({
    className: 'custom-location-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="background: ${color}; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 1px solid white; margin-bottom: 2px;">
          ${label}
        </div>
        <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: white;"></div>
        </div>
      </div>
    `,
    iconSize: [80, 42],
    iconAnchor: [40, 38],
  });

function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export function LogisticsMap({
  liveTracking = null,
  height = '360px',
  onShareLocation = null,
}) {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simIndex, setSimIndex] = useState(3);

  // Highway Route: Varanasi -> Jaunpur -> Sultanpur -> Lucknow
  const defaultRoute = [
    [25.3176, 82.9739], // 0: Varanasi
    [25.5500, 82.8000], // 1
    [25.7464, 82.6837], // 2: Jaunpur
    [25.9200, 82.4500], // 3: Active Position
    [26.2648, 82.0727], // 4: Sultanpur
    [26.5800, 81.5000], // 5: Jagdishpur
    [26.8467, 80.9462], // 6: Lucknow
  ];

  const polyline = liveTracking?.routePolyline || defaultRoute;
  const vehicleNumber = liveTracking?.vehicleNumber || 'UP65XX1234';
  const speed = liveTracking?.speed || '62 km/h';
  const eta = liveTracking?.eta || '2 hr 15 min';

  // Current position (either simulated or from API)
  const currentPos = isSimulating
    ? polyline[simIndex] || polyline[3]
    : liveTracking?.currentPosition || [25.9200, 82.4500];

  // Simulated GPS movement loop
  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimIndex((prev) => (prev >= polyline.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isSimulating, polyline]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onShareLocation) onShareLocation();
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Map Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Radio className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Live Tracking</h3>
          <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Demo Simulation Mode Toggle */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors border ${
            isSimulating
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
          }`}
        >
          {isSimulating ? '● Demo GPS Active' : 'Simulate GPS'}
        </button>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full" style={{ height }}>
        <MapContainer
          center={[26.0500, 81.9000]}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          <MapViewController center={currentPos} zoom={8} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Planned Highway Route */}
          <Polyline
            positions={polyline}
            pathOptions={{
              color: '#0284c7',
              weight: 4.5,
              opacity: 0.85,
              dashArray: '8, 4',
            }}
          />

          {/* Pickup Marker: Varanasi */}
          <Marker
            position={[25.3176, 82.9739]}
            icon={createLocationPin('Pickup Varanasi', '#107c41', true)}
          >
            <Popup>
              <div className="text-xs p-1">
                <strong>Pickup Point:</strong> Suryoday FPO, Varanasi<br />
                <strong>Departure:</strong> 08:30 AM
              </div>
            </Popup>
          </Marker>

          {/* Delivery Marker: Lucknow */}
          <Marker
            position={[26.8467, 80.9462]}
            icon={createLocationPin('Delivery Lucknow', '#e11d48', false)}
          >
            <Popup>
              <div className="text-xs p-1">
                <strong>Delivery Destination:</strong> AgroMart Hub, Lucknow<br />
                <strong>Estimated Arrival:</strong> 02:30 PM
              </div>
            </Popup>
          </Marker>

          {/* Real-time moving truck marker */}
          <Marker position={currentPos} icon={createVehicleIcon(vehicleNumber)}>
            <Popup>
              <div className="text-xs p-1">
                <strong>Vehicle:</strong> {vehicleNumber}<br />
                <strong>Speed:</strong> {speed}<br />
                <strong>ETA:</strong> {eta}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Highway Overlays matching screenshot (NH 731 / NH 227) */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none flex flex-col gap-1.5">
          <div className="px-2 py-1 rounded bg-white/90 backdrop-blur-xs border border-stone-300 text-[10px] font-black text-stone-700 shadow-xs">
            NH 731 Corridor
          </div>
          <div className="px-2 py-1 rounded bg-white/90 backdrop-blur-xs border border-stone-300 text-[10px] font-black text-stone-700 shadow-xs">
            NH 227 Connect
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Action Strip */}
      <div className="p-3.5 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-emerald-100 text-emerald-800">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-stone-900 leading-tight">Vehicle {vehicleNumber}</p>
              <p className="text-[11px] text-stone-500">Speed: <span className="font-semibold text-stone-700">{speed}</span></p>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-stone-200" />

          <div>
            <span className="text-[11px] text-stone-500">ETA:</span>{' '}
            <span className="font-bold text-emerald-800">{eta}</span>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 font-semibold text-xs shadow-2xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-stone-500" />
              <span>Share Live Location</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default LogisticsMap;

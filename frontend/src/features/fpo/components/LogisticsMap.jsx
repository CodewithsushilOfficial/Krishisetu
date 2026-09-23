import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom HTML DivIcons
const createVehicleIcon = (vehicleNumber) =>
  L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="background: #107c41; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 1px solid #ffffff; margin-bottom: 2px;">
          🚚 ${vehicleNumber || 'Vehicle'}
        </div>
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #107c41; border: 3px solid #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [80, 52],
    iconAnchor: [40, 50],
  });

const createHubIcon = (label, color = '#0284c7') =>
  L.divIcon({
    className: 'custom-hub-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="background: ${color}; color: white; padding: 1px 5px; border-radius: 4px; font-size: 9px; font-weight: bold; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.2); margin-bottom: 2px;">
          ${label}
        </div>
        <div style="width: 20px; height: 20px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></div>
      </div>
    `,
    iconSize: [70, 36],
    iconAnchor: [35, 34],
  });

const createDestIcon = (label) =>
  L.divIcon({
    className: 'custom-dest-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="background: #e11d48; color: white; padding: 1px 5px; border-radius: 4px; font-size: 9px; font-weight: bold; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.2); margin-bottom: 2px;">
          ${label}
        </div>
        <div style="width: 22px; height: 22px; border-radius: 50%; background: #e11d48; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [80, 40],
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
  shipment = null,
  compact = false,
  height = '420px',
  center = [25.7464, 82.6837],
  zoom = 8,
}) {
  // Default fallback route coordinates: Varanasi -> Jaunpur -> Sultanpur -> Lucknow
  const defaultRoute = [
    [25.3176, 82.9739], // Varanasi Hub
    [25.7464, 82.6837], // Jaunpur
    [26.2648, 82.0727], // Sultanpur
    [26.8467, 80.9462], // Lucknow
  ];

  const currentPos = shipment?.currentPosition || (shipment?.currentLocation ? [shipment.currentLocation.lat, shipment.currentLocation.lng] : [25.7464, 82.6837]);
  const polylineCoords = shipment?.polyline && shipment.polyline.length > 0 ? shipment.polyline : defaultRoute;
  const mapCenter = currentPos || center;

  const vehicleNum = shipment?.vehicle?.vehicleNumber || shipment?.vehicleNumber || 'UP65XX1234';
  const originName = shipment?.origin || 'Varanasi Central Hub';
  const destName = shipment?.destination || 'Lucknow Hotel Co.';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs" style={{ height }}>
      {/* Live Badge Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <span className="text-xs font-black text-stone-800 tracking-tight">
          {shipment?.status === 'IN_TRANSIT' ? 'Live Telemetry Active' : shipment?.status || 'Active Shipment'}
        </span>
        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
          {vehicleNum}
        </span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={compact ? 7 : zoom}
        scrollWheelZoom={!compact}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <MapViewController center={mapCenter} zoom={compact ? 7 : zoom} />

        {/* Standard OSM OpenStreetMap Tile Layer with Attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Polyline */}
        <Polyline
          positions={polylineCoords}
          pathOptions={{
            color: '#107c41',
            weight: compact ? 3 : 5,
            opacity: 0.85,
            dashArray: shipment?.status === 'ASSIGNED' ? '6, 8' : undefined,
          }}
        />

        {/* Origin Marker */}
        {polylineCoords[0] && (
          <Marker position={polylineCoords[0]} icon={createHubIcon('Origin: ' + originName.split(' ')[0], '#0284c7')}>
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold text-stone-900">Origin / Collection Center</p>
                <p className="text-stone-600 mt-0.5">{originName}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current Vehicle Position Marker */}
        {currentPos && (
          <Marker position={currentPos} icon={createVehicleIcon(vehicleNum)}>
            <Popup>
              <div className="text-xs font-sans p-1 min-w-[180px]">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-200">
                  <span className="font-black text-stone-900">{vehicleNum}</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {shipment?.status || 'IN_TRANSIT'}
                  </span>
                </div>
                <p className="text-stone-600">
                  <strong className="text-stone-800">Destination:</strong> {destName}
                </p>
                {shipment?.etaHours && (
                  <p className="text-stone-600 mt-0.5">
                    <strong className="text-stone-800">ETA:</strong> ~{shipment.etaHours} hrs
                  </p>
                )}
                <p className="text-stone-600 mt-0.5">
                  <strong className="text-stone-800">Temp:</strong> 18°C (Refrigerated)
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {polylineCoords[polylineCoords.length - 1] && (
          <Marker position={polylineCoords[polylineCoords.length - 1]} icon={createDestIcon(destName.split(' ')[0])}>
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold text-stone-900">Delivery Destination</p>
                <p className="text-stone-600 mt-0.5">{destName}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default LogisticsMap;

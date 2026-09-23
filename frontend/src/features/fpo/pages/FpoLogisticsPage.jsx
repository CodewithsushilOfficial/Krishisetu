import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import LogisticsMap from '../components/LogisticsMap.jsx';
import {
  Truck,
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  ShieldCheck,
  RefreshCw,
  Thermometer,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export function FpoLogisticsPage() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getShipments();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setShipments(list);

      if (list.length > 0) {
        const activeOne = list.find((s) => s.status === 'IN_TRANSIT') || list[0];
        setSelectedShipment(activeOne);
        loadRoute(activeOne.id);
      }
    } catch (err) {
      console.error('Failed to load shipments', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoute = async (shipmentId) => {
    try {
      const routeData = await fpoService.getShipmentRoute(shipmentId);
      const unwrapped = routeData?.polyline ? routeData : (routeData?.data || routeData);
      setSelectedRoute(unwrapped);
    } catch (err) {
      console.error('Failed to load route telemetry', err);
    }
  };

  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    loadRoute(shipment.id);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedShipment) return;
    try {
      await fpoService.updateShipmentStatus(selectedShipment.id, newStatus);
      loadShipments();
    } catch (err) {
      console.error('Failed to update shipment status', err);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const totalInTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const totalDelivered = shipments.filter((s) => s.status === 'DELIVERED').length;
  const activeVehicle = selectedShipment?.vehicle?.vehicleNumber || 'UP65XX1234';

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Logistics & Fleet Tracking
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  Real-time GPS telemetry, cold-chain monitoring, and dispatch routes across Purvanchal.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                loadShipments().finally(() => setRefreshing(false));
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
              {totalInTransit} In Transit
            </span>
          </div>
        </div>

        {/* 4 Quick Stat KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Active Fleets</p>
            <p className="text-2xl font-black text-stone-900 mt-1">{shipments.length}</p>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">100% telemetry enabled</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Dispatches In Transit</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{totalInTransit}</p>
            <span className="text-[10px] text-stone-500 font-medium mt-1 inline-block">Avg ETA ~2.5 hrs</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Cold-Chain Temperature</p>
            <p className="text-2xl font-black text-sky-700 mt-1">18.0°C</p>
            <span className="text-[10px] text-sky-700 font-bold mt-1 inline-block">Optimal for perishables</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Delivered This Month</p>
            <p className="text-2xl font-black text-stone-900 mt-1">{totalDelivered}</p>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">98.4% on-time record</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 35% LEFT LIST / 65% RIGHT LEAFLET MAP SPLIT LAYOUT           */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Shipments List (35% -> 4 or 5 cols out of 12) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Consignments & Vehicles ({shipments.length})
              </h2>
              <span className="text-[11px] text-stone-500 font-semibold">Select to view route</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-white rounded-2xl border border-stone-200/80 animate-pulse" />
                ))}
              </div>
            ) : shipments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                No active dispatches found.
              </div>
            ) : (
              <div className="space-y-3 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
                {shipments.map((s) => {
                  const isSelected = selectedShipment?.id === s.id;
                  const isTransit = s.status === 'IN_TRANSIT';
                  const cropName = s.order?.crop?.cropName || 'Fresh Produce';
                  const buyerName = s.order?.buyer?.businessName || 'Wholesale Buyer';
                  const qty = s.order?.quantityKg ? `${Number(s.order.quantityKg) / 1000} Ton` : '10 Ton';

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectShipment(s)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/50 border-[#107c41] shadow-md ring-2 ring-[#107c41]/20'
                          : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isTransit ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            🚚
                          </div>
                          <div>
                            <p className="text-xs font-black text-stone-900">
                              {s.vehicle?.vehicleNumber || s.id}
                            </p>
                            <p className="text-[10px] text-stone-500 font-semibold">{s.vehicle?.vehicleType || 'Container Truck'}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md leading-none ${
                            isTransit
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'DELIVERED'
                              ? 'bg-stone-100 text-stone-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      {/* Origin -> Destination */}
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-stone-800">
                        <span className="truncate max-w-[100px]">{s.origin?.split(',')[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[120px] text-emerald-800 font-bold">
                          {s.destination?.split(',')[0]}
                        </span>
                      </div>

                      {/* Cargo and Order Details */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span>
                          <strong className="text-stone-800">{qty}</strong> {cropName}
                        </span>
                        <span className="text-stone-400 font-medium">ETA: ~{s.etaHours || 2} hrs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Leaflet Map & Active Telemetry Telemetry (65% -> 8 cols out of 12) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Interactive Leaflet Map */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                    <Navigation className="h-4 w-4 text-emerald-700" />
                    Live Route & Telemetry: {activeVehicle}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {selectedShipment?.origin} ➔ {selectedShipment?.destination}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                    Distance: {selectedShipment?.distanceKm || 285} km
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ETA: ~{selectedShipment?.etaHours || 2} hrs
                  </span>
                </div>
              </div>

              {/* The Leaflet Map Component with OSM tiles and attribution */}
              <LogisticsMap
                shipment={selectedRoute || selectedShipment}
                height="450px"
                zoom={8}
              />

              {/* Telemetry Footer Controls */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-semibold text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-stone-400" />
                    <span>Driver: <strong>Ramesh Kumar</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-stone-400" />
                    <span>+91 94150 99881</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-700 font-bold">
                    <Thermometer className="h-3.5 w-3.5 text-sky-600" />
                    <span>18.0°C Stable</span>
                  </div>
                </div>

                {selectedShipment && selectedShipment.status !== 'DELIVERED' && (
                  <button
                    onClick={() => handleStatusUpdate('DELIVERED')}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoLogisticsPage;

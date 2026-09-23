import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, RefreshCw, ArrowRight, ShieldCheck, MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import { ShipmentAcceptModal } from '../components/ShipmentAcceptModal.jsx';
import logisticsService from '../services/logisticsService.js';

export function ShipmentsPage() {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shipRes, vehRes] = await Promise.all([
        logisticsService.getAvailableShipments(),
        logisticsService.getVehicles(),
      ]);
      setShipments(shipRes || []);
      setVehicles(vehRes || []);
    } catch (err) {
      console.error('Failed to load shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredShipments = shipments.filter((item) => {
    const matchesSearch =
      (item.originDistrict || item.origin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.destinationCity || item.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.cropName || item.order?.crop?.cropName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.loadId || item.trackingNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'ALL') return true;
    if (filterType === 'VEGETABLES') return ['Tomato', 'Potato', 'Onion'].some(c => (item.cropName || '').includes(c));
    if (filterType === 'GRAINS') return ['Wheat', 'Rice', 'Paddy'].some(c => (item.cropName || '').includes(c));
    if (filterType === 'HIGH_PAYOUT') return Number(item.payoutAmount || item.estimatedCost || 0) >= 10000;
    return true;
  });

  return (
    <LogisticsLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-stone-900 tracking-tight">Available Mandi Shipments</h1>
                <p className="text-xs text-stone-500">Real-time agricultural freight consignments from verified FPOs and bulk buyers</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search origin, destination, crop, or load ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'VEGETABLES', 'GRAINS', 'HIGH_PAYOUT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterType === tab
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab === 'ALL' && 'All Loads'}
                {tab === 'VEGETABLES' && 'Vegetables & Fruits'}
                {tab === 'GRAINS' && 'Grains & Pulses'}
                {tab === 'HIGH_PAYOUT' && 'High Payout (₹10k+)'}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments Grid */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-2" />
            <p className="text-xs text-stone-500 font-medium">Scanning mandi dispatch network...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90">
            <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No shipments found</p>
            <p className="text-xs text-stone-400 mt-1">Try changing your search keywords or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredShipments.map((ship) => {
              const payout = Number(ship.payoutAmount || ship.estimatedCost || 0);
              const distance = Number(ship.distanceKm || 150);
              const crop = ship.cropName || ship.order?.crop?.cropName || 'Farm Produce';
              const qty = Number(ship.quantityKg || ship.order?.totalQuantity || 0);
              const ratePerKm = distance > 0 ? (payout / distance).toFixed(1) : '45';

              return (
                <div
                  key={ship.id}
                  className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-400/80 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {ship.loadId || ship.trackingNumber || 'LS-LOAD'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {ship.status}
                      </span>
                    </div>

                    {/* Route Corridor */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-stone-800">{ship.originDistrict || ship.origin}</div>
                          <div className="text-[11px] text-stone-500">{ship.pickupLocation || 'Pickup Point'}</div>
                        </div>
                      </div>
                      <div className="pl-2">
                        <div className="w-0.5 h-4 bg-stone-200" />
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-stone-800">{ship.destinationCity || ship.destination}</div>
                          <div className="text-[11px] text-stone-500">{ship.deliveryLocation || 'Delivery Point'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Cargo Specs */}
                    <div className="mt-4 p-3 bg-stone-50 rounded-xl grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Commodity</span>
                        <span className="font-bold text-stone-800">{crop}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Consignment Load</span>
                        <span className="font-bold text-stone-800">
                          {qty >= 1000 ? `${(qty / 1000).toFixed(1)} Ton` : `${qty} kg`}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Distance</span>
                        <span className="font-bold text-stone-800">{distance} km</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Est. Transit</span>
                        <span className="font-bold text-stone-800">{ship.etaHours ? `${Number(ship.etaHours)} hrs` : '4-6 hrs'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-stone-900">₹{payout.toLocaleString()}</div>
                      <span className="text-[10px] font-semibold text-emerald-700">₹{ratePerKm}/km payout</span>
                    </div>

                    <button
                      onClick={() => setSelectedShipment(ship)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Accept Load <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accept Modal */}
      <ShipmentAcceptModal
        isOpen={Boolean(selectedShipment)}
        shipment={selectedShipment}
        vehicles={vehicles}
        onClose={() => setSelectedShipment(null)}
        onAccepted={(assignedTrip) => {
          setSelectedShipment(null);
          showToast(`Load accepted! Trip ${assignedTrip.tripCode || assignedTrip.id} scheduled.`);
          loadData();
        }}
      />
    </LogisticsLayout>
  );
}

export default ShipmentsPage;

import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { Layers, Warehouse, Filter, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export function FpoInventoryPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState('ALL');

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getInventory();
      setLots(Array.isArray(res) ? res : (res?.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredLots =
    cropFilter === 'ALL'
      ? lots
      : lots.filter((l) => (l.crop?.cropName || '').toUpperCase() === cropFilter);

  return (
    <FpoLayout>
      <div className="space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-700" /> Inventory & Lots Management
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Aggregated stock lots, quality segregation, reservations, and warehouse dispatch readiness
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="ALL">All Crops</option>
              <option value="POTATO">Potato</option>
              <option value="ONION">Onion</option>
              <option value="TOMATO">Tomato</option>
              <option value="WHEAT">Wheat</option>
              <option value="CHILLI">Chilli</option>
            </select>
          </div>
        </div>

        {/* Lots Grid */}
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading aggregated inventory...</div>
        ) : filteredLots.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80">
            <Warehouse className="h-10 w-10 mx-auto text-stone-300 mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No inventory batches found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLots.map((lot) => {
              const cropName = lot.crop?.cropName || 'Crop';
              const availTon = (Number(lot.availableQtyKg || 0) / 1000).toFixed(1);
              const resTon = (Number(lot.reservedQtyKg || 0) / 1000).toFixed(1);
              const inTransTon = (Number(lot.inTransitQtyKg || 0) / 1000).toFixed(1);
              const soldTon = (Number(lot.soldQtyKg || 0) / 1000).toFixed(1);
              const totalTon = (Number(availTon) + Number(resTon) + Number(inTransTon) + Number(soldTon)).toFixed(1);

              return (
                <div key={lot.id} className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5 space-y-4 hover:shadow-xs transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {lot.lotNumber || lot.id}
                      </span>
                      <h2 className="text-base font-bold text-stone-900 mt-1">{cropName}</h2>
                      <p className="text-xs text-stone-500">{lot.qualityGrade || 'Grade A'}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {lot.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50/80 rounded-xl border border-stone-100 text-xs">
                    <div>
                      <span className="text-[10px] font-medium text-stone-500">Available</span>
                      <p className="font-bold text-emerald-700">{availTon} Ton</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-stone-500">Reserved</span>
                      <p className="font-bold text-blue-700">{resTon} Ton</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-stone-500">In Transit</span>
                      <p className="font-bold text-purple-700">{inTransTon} Ton</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-stone-500">Sold</span>
                      <p className="font-bold text-stone-700">{soldTon} Ton</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400">Total Lot Volume</span>
                      <p className="font-bold text-stone-900">{totalTon} Ton</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400">Asking Price</span>
                      <p className="font-black text-emerald-700">₹{Number(lot.askingPricePerKg || 20)}/kg</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Warehouse className="h-3 w-3 text-stone-400" />
                    <span>{lot.warehouseLocation}</span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FpoLayout>
  );
}

export default FpoInventoryPage;

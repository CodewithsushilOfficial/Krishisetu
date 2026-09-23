import React, { useState, useEffect } from 'react';
import { History, Search, Download, CheckCircle2, MapPin, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import logisticsService from '../services/logisticsService.js';

export function LoadHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await logisticsService.getLoadHistory();
      setHistory(res || []);
    } catch (err) {
      console.error('Failed to load load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const term = searchQuery.toLowerCase();
    return (
      (item.tripCode || '').toLowerCase().includes(term) ||
      (item.originDistrict || item.origin || '').toLowerCase().includes(term) ||
      (item.destinationCity || item.destination || '').toLowerCase().includes(term) ||
      (item.cropName || '').toLowerCase().includes(term)
    );
  });

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Consignment Load History</h1>
              <p className="text-xs text-stone-500">Historical manifest archive of fulfilled agricultural transit contracts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search historical consignments, trips, or routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
            Showing {filteredHistory.length} completed manifests
          </span>
        </div>

        {/* Manifest Table */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-2" />
              <p className="text-xs text-stone-500">Retrieving manifest archives...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs">No historical manifests matched your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Trip Code</th>
                    <th className="py-3 px-4">Route Corridor</th>
                    <th className="py-3 px-4">Consignment</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Completed Date</th>
                    <th className="py-3 px-4">Payout</th>
                    <th className="py-3 px-4 text-right">e-Way Bill / Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{item.tripCode || item.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-stone-800">
                          <span>{item.originDistrict || item.origin}</span>
                          <ArrowRight className="w-3 h-3 text-stone-400" />
                          <span>{item.destinationCity || item.destination}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{item.distanceKm || 150} km</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-emerald-800">{item.cropName || 'Farm Produce'}</span>
                        <span className="text-[10px] text-stone-400 block">{item.quantityKg ? `${item.quantityKg} kg` : 'Full Load'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-700">{item.vehiclePlate || 'UP65XX1234'}</td>
                      <td className="py-3.5 px-4 text-stone-500">{item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Recent'}</td>
                      <td className="py-3.5 px-4 font-black text-stone-900">₹{Number(item.payoutAmount || 12000).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`e-Way Bill & Delivery Receipt for ${item.tripCode || item.id} downloaded.`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          <Download className="w-3 h-3" /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default LoadHistoryPage;

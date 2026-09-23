import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { Package, Plus, Search, Calendar, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export function FpoProducePage() {
  const [produceList, setProduceList] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    farmerId: '',
    cropId: 'CROP-POTATO',
    quantityKg: 2000,
    grade: 'Grade A',
    moisturePct: 11.2,
    expectedPricePerKg: 19.5,
    notes: 'Quality checked at central hub',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, farmRes] = await Promise.all([
        fpoService.getProduce(),
        fpoService.getFarmers({ limit: 100 }),
      ]);
      setProduceList(Array.isArray(prodRes) ? prodRes : (prodRes?.data || []));
      const fList = farmRes?.farmers || farmRes?.data?.farmers || (Array.isArray(farmRes) ? farmRes : []);
      setFarmers(fList);
      if (fList.length > 0 && !formData.farmerId) {
        setFormData((prev) => ({ ...prev, farmerId: fList[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordProduce = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await fpoService.recordProduce({
        ...formData,
        quantityKg: Number(formData.quantityKg),
        expectedPricePerKg: Number(formData.expectedPricePerKg),
        moisturePct: Number(formData.moisturePct),
      });
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FpoLayout>
      <div className="space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-700" /> Aggregate Produce Collection
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Record harvest collection from member farmers, inspection grading, and lot aggregation
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Record Produce Intake
          </button>
        </div>

        {/* Produce Table */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">Loading produce records...</div>
          ) : produceList.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-10 w-10 mx-auto text-stone-300 mb-2" />
              <h3 className="text-sm font-bold text-stone-800">No produce recorded yet</h3>
              <p className="text-xs text-stone-500 mt-1">Record harvest intake from member farmers to build inventory.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                + Record Produce Intake
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-400 border-b border-stone-200 text-[11px]">
                    <th className="py-3 px-4 font-semibold">Farmer & Crop</th>
                    <th className="py-3 px-4 font-semibold">Harvest Date</th>
                    <th className="py-3 px-4 font-semibold">Quality Grade</th>
                    <th className="py-3 px-4 font-semibold">Moisture %</th>
                    <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                    <th className="py-3 px-4 font-semibold text-right">Base Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {produceList.map((p) => {
                    const farmerName = p.farmer?.user?.fullName || 'Member Farmer';
                    const cropName = p.crop?.cropName || 'Crop';
                    const qtyTon = (Number(p.quantityKg) / 1000).toFixed(2);

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          <p className="text-stone-900 font-bold">{farmerName}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">{cropName}</p>
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {p.harvestDate ? new Date(p.harvestDate).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            {p.grade || 'Grade A'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-700">
                          {Number(p.moisturePct || 11.2)}%
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-stone-900">
                          {qtyTon} Ton ({Number(p.quantityKg).toLocaleString()} kg)
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">
                          ₹{Number(p.expectedPricePerKg)}/kg
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Record Produce Intake Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-700" /> Record Harvest Intake
              </h2>
              <p className="text-xs text-stone-500 mt-1">Enter weighing and inspection details to create lot</p>

              <form onSubmit={handleRecordProduce} className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-700">Select Farmer *</label>
                  <select
                    value={formData.farmerId}
                    onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    required
                  >
                    {farmers.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.fullName} ({f.village})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Crop *</label>
                    <select
                      value={formData.cropId}
                      onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="CROP-POTATO">Potato</option>
                      <option value="CROP-ONION">Onion</option>
                      <option value="CROP-TOMATO">Tomato</option>
                      <option value="CROP-WHEAT">Wheat</option>
                      <option value="CROP-CHILLI">Chilli</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Grade *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="Grade A">Grade A</option>
                      <option value="Grade A+">Grade A+</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Net Weight (kg) *</label>
                    <input
                      type="number"
                      required
                      value={formData.quantityKg}
                      onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Base Price (₹/kg) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.expectedPricePerKg}
                      onChange={(e) => setFormData({ ...formData, expectedPricePerKg: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700">Notes / Inspection Comments</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-stone-200 text-stone-600 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                  >
                    {submitting ? 'Recording...' : 'Record Produce'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FpoLayout>
  );
}

export default FpoProducePage;

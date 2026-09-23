import React, { useState, useEffect } from 'react';
import { Fuel, Plus, Calendar, CheckCircle2, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import { AddExpenseModal } from '../components/AddExpenseModal.jsx';
import logisticsService from '../services/logisticsService.js';

export function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expRes, vehRes] = await Promise.all([
        logisticsService.getExpenses(),
        logisticsService.getVehicles(),
      ]);
      setExpenses(expRes || []);
      setVehicles(vehRes || []);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalFuel = expenses.filter(e => e.expenseType === 'FUEL').reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const totalToll = expenses.filter(e => e.expenseType === 'TOLL').reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const totalOther = expenses.filter(e => !['FUEL', 'TOLL'].includes(e.expenseType)).reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const totalExpenses = totalFuel + totalToll + totalOther;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <LogisticsLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Fuel & Operational Expenses</h1>
              <p className="text-xs text-stone-500">Diesel consumption records, FASTag electronic tolls, and trip allowances</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Log Expense
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Total Transit Expenses</span>
            <div className="text-2xl font-black text-stone-900 mt-1">₹{totalExpenses.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500">This billing month</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Diesel Fuel Spend</span>
            <div className="text-2xl font-black text-amber-700 mt-1">₹{totalFuel.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500">Avg ₹90.4/L bulk price</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">FASTag / Highway Tolls</span>
            <div className="text-2xl font-black text-blue-700 mt-1">₹{totalToll.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500">NHAI automated corridor deductions</span>
          </div>
        </div>

        {/* Expense Records Table */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">Expense Log Archive</h3>
            <span className="text-xs font-semibold text-stone-500">{expenses.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity (L)</th>
                  <th className="py-3 px-4">Cost / Litre</th>
                  <th className="py-3 px-4">Notes / Station</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-stone-600">{new Date(exp.expenseDate || exp.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{exp.vehicle?.plateNumber || exp.vehicle?.vehicleNumber || 'UP65XX1234'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                        {exp.expenseType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{exp.fuelLiters ? `${exp.fuelLiters} L` : '-'}</td>
                    <td className="py-3.5 px-4 text-stone-600">{exp.ratePerLiter ? `₹${exp.ratePerLiter}` : '-'}</td>
                    <td className="py-3.5 px-4 text-stone-500">{exp.notes || exp.receiptNumber || 'Transit Expense'}</td>
                    <td className="py-3.5 px-4 font-black text-stone-900 text-right">₹{Number(exp.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        vehicles={vehicles}
        trips={[]}
        onClose={() => setIsAddModalOpen(false)}
        onExpenseAdded={(newExp) => {
          showToast(`Expense of ₹${Number(newExp.amount).toLocaleString()} logged!`);
          loadData();
        }}
      />
    </LogisticsLayout>
  );
}

export default ExpensesPage;

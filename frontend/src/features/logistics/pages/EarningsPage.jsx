import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowDownToLine, TrendingUp, CheckCircle2, Clock, Calendar, Download, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import logisticsService from '../services/logisticsService.js';

export function EarningsPage() {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const res = await logisticsService.getEarnings();
      setEarningsData(res || {});
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setToastMessage('Payout request of ₹18,500 submitted to Escrow Clearing. Settlement within 2 hrs.');
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  const total = Number(earningsData?.totalEarnings || 64200);
  const available = Number(earningsData?.availablePayout || 18500);
  const pending = Number(earningsData?.inEscrow || 9800);
  const fuelDeductions = Number(earningsData?.totalExpenses || 12400);
  const net = total - fuelDeductions;

  const weeklyBars = earningsData?.weeklyBreakdown || [
    { day: 'Mon', amount: 9200 },
    { day: 'Tue', amount: 11400 },
    { day: 'Wed', amount: 8600 },
    { day: 'Thu', amount: 14200 },
    { day: 'Fri', amount: 12000 },
    { day: 'Sat', amount: 8800 },
    { day: 'Sun', amount: 0 },
  ];

  const transactions = earningsData?.transactions || [
    { id: 'TXN-90812', date: '2026-09-21', trip: 'TR-KSF001', crop: 'Potato 8 Ton', amount: 14200, status: 'CREDITED', method: 'UPI / HDFC' },
    { id: 'TXN-88741', date: '2026-09-19', trip: 'TR002', crop: 'Tomato 6 Ton', amount: 9800, status: 'CREDITED', method: 'Bank Transfer' },
    { id: 'TXN-85420', date: '2026-09-17', trip: 'TR001', crop: 'Paddy 10 Ton', amount: 15400, status: 'CREDITED', method: 'UPI / HDFC' },
    { id: 'TXN-83110', date: '2026-09-14', trip: 'TR-HIST-09', crop: 'Wheat 12 Ton', amount: 18600, status: 'CREDITED', method: 'Bank Transfer' },
  ];

  const maxWeekly = Math.max(...weeklyBars.map((w) => w.amount), 1);

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
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Earnings & Payout Ledger</h1>
              <p className="text-xs text-stone-500">Autonomous Escrow releases, freight bills, and weekly direct bank settlements</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleWithdraw}
              disabled={withdrawing || available <= 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <ArrowDownToLine className="w-4 h-4" />
              {withdrawing ? 'Processing...' : 'Withdraw to Bank (UPI)'}
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Total Freight Revenue</span>
            <div className="text-2xl font-black text-stone-900 mt-1">₹{total.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% vs last month
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Available for Withdrawal</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{available.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500">Instant payout eligible</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Locked in Escrow</span>
            <div className="text-2xl font-black text-amber-700 mt-1">₹{pending.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500">Releases upon delivery OTP</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Net Profit Margin</span>
            <div className="text-2xl font-black text-stone-900 mt-1">₹{net.toLocaleString()}</div>
            <span className="text-[11px] text-stone-500">After fuel & maintenance</span>
          </div>
        </div>

        {/* Weekly Bar Chart & Payout Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm text-stone-900">Weekly Revenue Inflow</h3>
              <span className="text-xs font-semibold text-stone-500">This Week (₹64,200)</span>
            </div>

            {/* Bars */}
            <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6">
              {weeklyBars.map((bar, i) => {
                const heightPercent = Math.round((bar.amount / maxWeekly) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-stone-400 group-hover:text-emerald-700 font-bold transition-colors">
                      {bar.amount > 0 ? `₹${(bar.amount / 1000).toFixed(1)}k` : '-'}
                    </div>
                    <div className="w-full max-w-[42px] bg-stone-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-emerald-600 group-hover:bg-emerald-500 transition-all rounded-t-lg"
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-600">{bar.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900 mb-3">Linked Bank Account</h3>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Bank</span>
                  <strong className="text-stone-900">HDFC Bank Ltd</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Account</span>
                  <strong className="text-stone-900 font-mono">•••• 4892</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">IFSC</span>
                  <strong className="text-stone-900 font-mono">HDFC0001248</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">UPI VPA</span>
                  <strong className="text-stone-900 font-mono">suresh@okaxis</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100">
              <span className="text-[11px] text-stone-400 block mb-1">Weekly Settlement Cycle</span>
              <p className="text-xs text-stone-600 font-medium">Automatic Tuesday batch clearing or on-demand instant UPI transfer.</p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">Recent Settlement Transactions</h3>
            <span className="text-xs font-semibold text-stone-500">All trips protected by KrishiSetu Escrow</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">TXN ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Trip Code</th>
                  <th className="py-3 px-4">Consignment</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payout Method</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{tx.id}</td>
                    <td className="py-3.5 px-4 text-stone-500">{tx.date}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">{tx.trip}</td>
                    <td className="py-3.5 px-4 font-medium text-stone-700">{tx.crop}</td>
                    <td className="py-3.5 px-4 font-black text-stone-900">₹{tx.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-stone-600">{tx.method}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default EarningsPage;

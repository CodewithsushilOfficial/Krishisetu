import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerPayments } from '../hooks/useFarmerData.js';
import { CreditCard, ShieldCheck, Clock, ArrowUpRight, CheckCircle2, Building, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function PaymentsPage() {
  useEffect(() => {
    document.title = 'Payments & Earnings | KrishiSetu';
  }, []);

  const { data: paymentsData, isLoading, error, refetch } = useFarmerPayments();

  const summary = paymentsData?.summary || {
    totalEarnings: 124800,
    escrowLocked: 48500,
    pendingPayments: 18200,
    bankAccountLinked: true,
    bankDetails: {
      bankName: 'State Bank of India (Kashi Branch)',
      accountNumber: '•••• •••• 4892',
      ifsc: 'SBIN0001234',
    },
  };

  const monthlyHistory = paymentsData?.monthlyHistory || [
    { month: 'Mar', amount: 12000 },
    { month: 'Apr', amount: 18500 },
    { month: 'May', amount: 22000 },
    { month: 'Jun', amount: 19500 },
    { month: 'Jul', amount: 24800 },
    { month: 'Aug', amount: 28000 },
  ];

  const transactions = paymentsData?.transactions || [];

  return (
    <DashboardLayout title="Payments & Earnings" subtitle="Direct bank settlements, escrow-protected transactions, and earnings breakdown" fullWidth={true}>
      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">Settled Earnings</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-100 text-[#107c41] flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹ {summary.totalEarnings?.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#138808] mt-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+22% vs previous period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">Escrow Locked</span>
            <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900 mt-2">
            ₹ {summary.escrowLocked?.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 font-medium">Auto-releases upon delivery OTP</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">Pending Invoices</span>
            <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">
            ₹ {summary.pendingPayments?.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 font-medium">Awaiting logistics dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">Direct Bank Link</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-[#107c41] flex items-center justify-center">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="text-sm font-black text-slate-900 mt-2">
            {summary.bankDetails?.bankName}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono mt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#107c41]" />
            <span>{summary.bankDetails?.accountNumber}</span>
          </div>
        </div>
      </div>

      {/* Chart & Escrow Security Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Monthly Revenue Stream</h2>
              <p className="text-xs text-stone-400 font-medium">Historical monthly earnings in ₹ (Last 6 Months)</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs shadow-lg">
                          <p className="font-semibold text-stone-300">{payload[0].payload.month}</p>
                          <p className="font-black text-emerald-400 text-sm">₹ {payload[0].value.toLocaleString('en-IN')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" fill="#107c41" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Escrow Guarantee Explainer */}
        <div className="bg-gradient-to-br from-[#0c4e2a] to-[#107c41] text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black">KrishiSetu Escrow Guarantee</h3>
            <p className="text-xs text-emerald-100 font-medium mt-2 leading-relaxed">
              Every bulk trade on KrishiSetu requires buyers to lock 100% of order funds into accredited escrow accounts before dispatch.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-emerald-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span>Zero payment defaults or dishonored cheques</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span>Instant settlement upon delivery confirmation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span>Direct credit to your verified bank account</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-emerald-500/40 text-[11px] text-emerald-200">
            Regulated via RBI & NABARD Agri-Fintech guidelines
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">Transaction History</h2>
          <span className="text-xs text-stone-400 font-medium">{transactions.length} record(s)</span>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="p-5 space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-stone-100 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && transactions.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-500">
            No payment transactions recorded yet.
          </div>
        )}

        {/* Transactions Table */}
        {!isLoading && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-500">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order ID / Buyer</th>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-900">
                      {t.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{t.orderId}</div>
                      <div className="text-[11px] text-stone-400">{t.buyerName}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {t.cropName}
                    </td>
                    <td className="py-3 px-4 font-black text-[#107c41]">
                      ₹ {t.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        t.status === 'SETTLED'
                          ? 'bg-[#e6f8ed] text-[#138808]'
                          : 'bg-[#e8f3ff] text-[#1971c2]'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          t.status === 'SETTLED' ? 'bg-[#138808]' : 'bg-[#1971c2]'
                        }`} />
                        <span>{t.status === 'SETTLED' ? 'Settled' : 'Escrow Locked'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-stone-500 font-medium">
                      {t.method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PaymentsPage;

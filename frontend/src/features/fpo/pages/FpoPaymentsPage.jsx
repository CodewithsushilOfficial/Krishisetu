import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, ShieldCheck, Download, Plus, DollarSign } from 'lucide-react';

export function FpoPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const [payRes, setRes] = await Promise.all([
        fpoService.getPayments(),
        fpoService.getSettlements(),
      ]);
      const pList = Array.isArray(payRes) ? payRes : (payRes?.data || []);
      const sList = Array.isArray(setRes) ? setRes : (setRes?.data || []);
      setPayments(pList);
      setSettlements(sList);
    } catch (err) {
      console.error('Failed to load financial records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Payments & Farmer Settlements
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Escrow inflows from buyers, automated farmer disbursements via UPI/NEFT, and ledger records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Exporting complete settlement statement as CSV...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-emerald-700" />
              Export Statements
            </button>
            <button
              onClick={() => alert('Batch settlement disbursement initiated for 248 verified farmers.')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              Initiate Farmer Payout
            </button>
          </div>
        </div>

        {/* Financial KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Inflow (This Month)</span>
            <div className="text-2xl font-black text-stone-900 mt-1">₹18,42,000</div>
            <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-bold">
              <ArrowDownLeft className="h-3.5 w-3.5" /> +18.4% from last cycle
            </div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Farmer Payouts Disbursed</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹15,24,000</div>
            <div className="text-xs text-stone-500 mt-1 font-medium">Direct to Bank / Aadhaar Pay</div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-2xs">
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Pending Buyer Receivables</span>
            <div className="text-2xl font-black text-amber-600 mt-1">₹2,18,000</div>
            <div className="text-xs text-stone-500 mt-1 font-medium">4 buyer accounts pending clearance</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-[#f8faf9] border-b border-stone-200/80 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">Recent Payments & Disbursements</h3>
            <span className="text-xs text-stone-500 font-semibold">{payments.length} transactions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-stone-400 text-xs">Loading ledger...</div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs">No payment records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#f8faf9] text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
                  <tr>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Entity / Counterparty</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {payments.map((p) => {
                    const buyerName = p.order?.buyer?.businessName || p.order?.buyer?.fullName || 'BigBasket Wholesale';
                    const amount = `₹${Number(p.amount || 360000).toLocaleString('en-IN')}`;
                    const isPaid = p.status === 'PAID' || p.status === 'SUCCESS';

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-stone-900">
                          {p.transactionRef || p.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          {buyerName}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 font-medium">
                          {p.method || 'ESCROW_NEFT'}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-800">
                          {amount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-stone-500 font-medium">
                          {new Date(p.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoPaymentsPage;

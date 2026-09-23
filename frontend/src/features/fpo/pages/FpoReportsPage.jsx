import React, { useState } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Package, Users, FileSpreadsheet } from 'lucide-react';

export function FpoReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');

  const reportCards = [
    {
      title: 'Procurement & Aggregation Summary',
      description: 'Volume aggregated per collection center, crop wastage rates, and farmer intake logs.',
      metric: '1,250 Tons',
      period: 'Past 30 Days',
      type: 'PROCUREMENT',
    },
    {
      title: 'Financial Settlement & P&L Statement',
      description: 'Gross buyer revenue, FPO operational commission, transport deductions, and net farmer payouts.',
      metric: '₹18,42,000',
      period: 'Past 30 Days',
      type: 'FINANCE',
    },
    {
      title: 'Institutional Fulfillment & Logistics Audit',
      description: 'On-time delivery percentages, vehicle trip telemetry, and cold-chain temperature SLA compliance.',
      metric: '98.4%',
      period: 'Past 30 Days',
      type: 'LOGISTICS',
    },
    {
      title: 'Farmer Member Participation Report',
      description: 'Active vs inactive member farmers, average earnings per farmer, and crop diversification indices.',
      metric: '248 Active',
      period: 'Current Season',
      type: 'FARMERS',
    },
  ];

  const handleDownloadReport = (type) => {
    alert(`Generating ${type} report export (CSV / PDF)...`);
  };

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Reports & Executive Analytics
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Download formal audit logs, statutory compliance statements, and operational performance dossiers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['WEEKLY', 'MONTHLY', 'ANNUAL'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#107c41] text-white shadow-2xs'
                    : 'bg-stone-50 border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reportCards.map((rep, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200/80 hover:border-emerald-400 rounded-2xl p-6 shadow-2xs hover:shadow-xs flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                      {rep.period}
                    </span>
                    <h3 className="text-base font-black text-stone-900 mt-1.5">{rep.title}</h3>
                  </div>
                  <span className="text-xl font-black text-emerald-800">{rep.metric}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed bg-[#f8faf9] p-3.5 rounded-xl border border-stone-200/60 font-medium">
                  {rep.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium">Formats: CSV, PDF, Excel</span>
                <button
                  onClick={() => handleDownloadReport(rep.type)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-xs font-bold border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoReportsPage;

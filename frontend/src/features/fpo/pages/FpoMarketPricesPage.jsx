import React, { useState } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import { TrendingUp, TrendingDown, MapPin, Calendar, Search, DollarSign } from 'lucide-react';

export function FpoMarketPricesPage() {
  const [search, setSearch] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('ALL');

  const prices = [
    { crop: 'Potato', variety: 'Chipsona / Jyoti', modalPrice: 21.5, minPrice: 19.0, maxPrice: 23.5, trend: '+4.2%', isUp: true, mandi: 'Varanasi APMC' },
    { crop: 'Onion', variety: 'Nasik Red (Stored)', modalPrice: 28.0, minPrice: 25.0, maxPrice: 31.0, trend: '+8.5%', isUp: true, mandi: 'Mirzapur APMC' },
    { crop: 'Tomato', variety: 'Hybrid Grade-A', modalPrice: 18.0, minPrice: 15.5, maxPrice: 21.0, trend: '-3.1%', isUp: false, mandi: 'Varanasi APMC' },
    { crop: 'Wheat', variety: 'Sharbati PBW-502', modalPrice: 24.2, minPrice: 23.0, maxPrice: 25.5, trend: '+1.2%', isUp: true, mandi: 'Prayagraj APMC' },
    { crop: 'Green Chilli', variety: 'G4 Hot', modalPrice: 42.0, minPrice: 38.0, maxPrice: 46.0, trend: '+12.0%', isUp: true, mandi: 'Jaunpur APMC' },
    { crop: 'Mustard', variety: 'Pusa Bold', modalPrice: 52.0, minPrice: 49.0, maxPrice: 54.5, trend: '-0.8%', isUp: false, mandi: 'Varanasi APMC' },
  ];

  const filteredPrices = prices.filter((item) => {
    const matchesSearch = item.crop.toLowerCase().includes(search.toLowerCase()) ||
                          item.variety.toLowerCase().includes(search.toLowerCase());
    const matchesMandi = selectedMandi === 'ALL' || item.mandi.includes(selectedMandi);
    return matchesSearch && matchesMandi;
  });

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Live Mandi & APMC Market Intelligence
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Real-time Agmarknet & local Uttar Pradesh APMC yard rates for informed lot pricing and sales negotiation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/80 font-semibold">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            <span>Updated Today, 08:30 AM</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search crop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8faf9] border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['ALL', 'Varanasi', 'Mirzapur', 'Prayagraj', 'Jaunpur'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMandi(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedMandi === m
                    ? 'bg-[#107c41] text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {m === 'ALL' ? 'All Mandis' : `${m} APMC`}
              </button>
            ))}
          </div>
        </div>

        {/* Price Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrices.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200/80 hover:border-emerald-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-stone-900">{item.crop}</h3>
                  <span className="text-[11px] text-stone-500 font-semibold">{item.variety}</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  item.isUp
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {item.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.trend}
                </span>
              </div>

              <div className="bg-[#f8faf9] rounded-xl p-3.5 border border-stone-200/60 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-stone-500 font-medium">Modal Mandi Price</span>
                  <span className="text-xl font-black text-emerald-800">
                    ₹{item.modalPrice} <span className="text-xs font-semibold text-stone-500">/ kg</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-500 pt-2 border-t border-stone-200">
                  <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}/kg</span>
                  <span className="flex items-center gap-1 text-stone-700 font-bold">
                    <MapPin className="h-3 w-3 text-emerald-600" />
                    {item.mandi}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                <span className="text-stone-500 font-medium">Recommended FPO Base:</span>
                <span className="font-bold text-stone-900">₹{(item.modalPrice * 1.05).toFixed(1)}/kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoMarketPricesPage;

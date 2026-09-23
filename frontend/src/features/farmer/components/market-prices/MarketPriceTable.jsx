import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Building2, Calendar, Tag } from 'lucide-react';

export function MarketPriceTable({ records = [], pagination = {}, onPageChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('arrivalDateIso');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'modalPrice' || field === 'arrivalDateIso' ? 'desc' : 'asc');
    }
  };

  const processedRecords = useMemo(() => {
    let list = [...records];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.market.toLowerCase().includes(q) ||
          r.variety.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.commodity.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [records, searchTerm, sortField, sortOrder]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-[#107c41]" /> Live APMC Mandi Rates
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {records.length} records
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Filter mandi or variety..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-emerald-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200/80 bg-stone-50/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Commodity / Variety</th>
              <th className="py-3 px-4">Location (State • District)</th>
              <th
                onClick={() => handleSort('market')}
                className="py-3 px-4 cursor-pointer hover:text-stone-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Market / Mandi</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('arrivalDateIso')}
                className="py-3 px-4 cursor-pointer hover:text-stone-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Arrival Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('minPrice')}
                className="py-3 px-4 text-right cursor-pointer hover:text-stone-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Min Price</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('maxPrice')}
                className="py-3 px-4 text-right cursor-pointer hover:text-stone-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Max Price</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('modalPrice')}
                className="py-3 px-4 text-right cursor-pointer hover:text-stone-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Modal Price (₹/Qtl)</span>
                  <ArrowUpDown className="h-3 w-3 text-emerald-600" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
            {processedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-stone-400">
                  No mandi records matching your current filter.
                </td>
              </tr>
            ) : (
              processedRecords.map((r, idx) => (
                <tr
                  key={r.recordHash || `${r.market}-${r.arrivalDate}-${idx}`}
                  className="hover:bg-emerald-50/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{r.commodity}</span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold">
                        {r.variety}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-500">
                    <span className="font-semibold text-stone-800">{r.district}</span>, {r.state}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900">{r.market}</td>
                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-stone-400" />
                      <span>{r.arrivalDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-stone-600">
                    ₹{r.minPrice?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-stone-600">
                    ₹{r.maxPrice?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="font-black text-sm text-[#107c41]">
                        ₹{r.modalPrice?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">
                        ₹{r.pricePerKg}/kg
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 bg-stone-50/50">
          <div>
            Showing Page <span className="font-bold text-stone-800">{pagination.page}</span> of{' '}
            <span className="font-bold text-stone-800">{pagination.totalPages}</span> ({pagination.total} total records)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketPriceTable;

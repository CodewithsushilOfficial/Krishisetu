import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export function DateFilter({ selectedDate, onSelectDate }) {
  const [showCustom, setShowCustom] = useState(false);

  // Helper to format ISO date
  const getTodayIso = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getYesterdayIso = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const todayIso = getTodayIso();
  const yesterdayIso = getYesterdayIso();

  return (
    <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl text-xs font-bold text-stone-600">
      <button
        type="button"
        onClick={() => {
          setShowCustom(false);
          onSelectDate('');
        }}
        className={`px-2.5 py-1.5 rounded-lg transition-colors ${
          !selectedDate && !showCustom
            ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
            : 'hover:text-stone-900'
        }`}
      >
        Latest
      </button>

      <button
        type="button"
        onClick={() => {
          setShowCustom(false);
          onSelectDate(todayIso);
        }}
        className={`px-2.5 py-1.5 rounded-lg transition-colors ${
          selectedDate === todayIso
            ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
            : 'hover:text-stone-900'
        }`}
      >
        Today
      </button>

      <button
        type="button"
        onClick={() => {
          setShowCustom(false);
          onSelectDate(yesterdayIso);
        }}
        className={`px-2.5 py-1.5 rounded-lg transition-colors ${
          selectedDate === yesterdayIso
            ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
            : 'hover:text-stone-900'
        }`}
      >
        Yesterday
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            showCustom || (selectedDate && selectedDate !== todayIso && selectedDate !== yesterdayIso)
              ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
              : 'hover:text-stone-900'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{selectedDate && selectedDate !== todayIso && selectedDate !== yesterdayIso ? selectedDate : 'Custom'}</span>
        </button>

        {showCustom && (
          <div className="absolute right-0 mt-2 p-2 bg-white rounded-xl shadow-lg border border-stone-200 z-50 animate-in fade-in">
            <input
              type="date"
              value={selectedDate || todayIso}
              onChange={(e) => {
                onSelectDate(e.target.value);
                setShowCustom(false);
              }}
              max={todayIso}
              className="text-xs font-semibold px-2 py-1 rounded bg-stone-50 border border-stone-200 outline-none focus:border-emerald-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DateFilter;

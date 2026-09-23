import React from 'react';
import { Tag } from 'lucide-react';

export function VarietySelector({ varieties = [], selectedVariety, onSelectVariety }) {
  if (!varieties || varieties.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 shrink-0">
        <Tag className="h-3 w-3" /> Variety:
      </span>

      <button
        type="button"
        onClick={() => onSelectVariety('')}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
          !selectedVariety || selectedVariety === 'All Varieties'
            ? 'bg-[#107c41] text-white'
            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        }`}
      >
        All Varieties
      </button>

      {varieties.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onSelectVariety(v)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            selectedVariety === v
              ? 'bg-[#107c41] text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export default VarietySelector;

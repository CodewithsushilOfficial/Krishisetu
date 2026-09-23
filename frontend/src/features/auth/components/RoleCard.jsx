import React from 'react';
import { ArrowRight } from 'lucide-react';

export function RoleCard({
  roleKey,
  title,
  imageSrc,
  isSelected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(roleKey)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-2.5 sm:p-3 text-left transition-all duration-200 cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/40 ${
        isSelected
          ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600 -translate-y-1'
          : 'border-stone-200 shadow-2xs hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-950/5'
      }`}
    >
      {/* Compact Image Canvas - Full Uncropped Showcase */}
      <div className="relative w-full aspect-square rounded-xl bg-gradient-to-b from-stone-50 to-stone-100/70 p-2 sm:p-2.5 flex items-center justify-center overflow-hidden group-hover:from-emerald-50/50 group-hover:to-emerald-100/30 transition-colors duration-200">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-contain drop-shadow-xs transition-transform duration-200 ease-out group-hover:scale-105"
          loading="eager"
        />
      </div>

      {/* Sleek Compact Footer */}
      <div className="mt-2 flex items-center justify-between gap-1 px-1 py-0.5">
        <h3 className="text-xs sm:text-sm font-bold tracking-tight text-stone-800 group-hover:text-emerald-700 transition-colors truncate">
          {title}
        </h3>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105'
          }`}
        >
          <ArrowRight className="h-3 w-3 stroke-[2.5]" />
        </div>
      </div>
    </button>
  );
}

export default RoleCard;

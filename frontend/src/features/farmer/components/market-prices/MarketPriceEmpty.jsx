import React from 'react';
import { AlertCircle, Calendar, MapPin, RefreshCw, Sprout } from 'lucide-react';

export function MarketPriceEmpty({
  commodity = 'Crop',
  district = 'Location',
  date = '',
  onTryAnotherDate,
  onChangeDistrict,
  onChangeCommodity,
}) {
  return (
    <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-8 sm:p-12 text-center space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base font-extrabold text-stone-900">
          No {commodity} mandi price data found
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed">
          No APMC arrival or settlement records for <span className="font-bold text-stone-700">{commodity}</span> were reported in{' '}
          <span className="font-bold text-stone-700">{district}</span>
          {date ? ` for ${date}` : ''}.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {onTryAnotherDate && (
          <button
            type="button"
            onClick={onTryAnotherDate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors shadow-2xs"
          >
            <Calendar className="h-3.5 w-3.5 text-stone-400" />
            <span>Try Another Date</span>
          </button>
        )}

        {onChangeDistrict && (
          <button
            type="button"
            onClick={onChangeDistrict}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors shadow-2xs"
          >
            <MapPin className="h-3.5 w-3.5 text-stone-400" />
            <span>Change District</span>
          </button>
        )}

        {onChangeCommodity && (
          <button
            type="button"
            onClick={onChangeCommodity}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#107c41] text-white text-xs font-bold hover:bg-[#0b5c30] transition-colors shadow-xs"
          >
            <Sprout className="h-3.5 w-3.5" />
            <span>Change Commodity</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default MarketPriceEmpty;

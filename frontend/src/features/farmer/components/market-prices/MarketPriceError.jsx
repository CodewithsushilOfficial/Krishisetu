import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function MarketPriceError({ error, onRetry }) {
  return (
    <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-8 text-center space-y-3">
      <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="h-5 w-5" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-red-900">
          Market price service is temporarily unavailable
        </h3>
        <p className="text-xs text-red-600/90 max-w-sm mx-auto">
          {error?.message || 'Could not connect to the Government Mandi API. Please try again in a few moments.'}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

export default MarketPriceError;

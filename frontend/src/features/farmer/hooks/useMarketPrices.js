import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import marketPriceService from '../services/marketPriceService.js';

/**
 * 1. Live variety-wise market prices with granular filters
 * Query key contains ALL filter parameters so changing any filter triggers immediate fresh fetch.
 */
export function useLiveMarketPrices({
  commodity = 'Tomato',
  state = 'Uttar Pradesh',
  district = '',
  market = '',
  variety = '',
  arrivalDate = '',
  page = 1,
  limit = 50,
  enabled = true,
} = {}) {
  const filterParams = {
    commodity,
    state,
    district,
    market,
    variety,
    arrivalDate,
    page,
    limit,
  };

  return useQuery({
    queryKey: ['market-prices', 'live', filterParams],
    queryFn: () => marketPriceService.getMarketPrices(filterParams),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    refetchInterval: 1000 * 60 * 15, // 15-minute background auto-refresh
    refetchOnWindowFocus: false,
    enabled: Boolean(enabled),
  });
}

/**
 * 2. Historical price trend timeseries for charts
 */
export function usePriceTrend({
  commodity = 'Tomato',
  state = 'Uttar Pradesh',
  district = '',
  market = '',
  days = 30,
  enabled = true,
} = {}) {
  const filterParams = { commodity, state, district, market, days };

  return useQuery({
    queryKey: ['market-prices', 'trend', filterParams],
    queryFn: () => marketPriceService.getPriceTrend(filterParams),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(enabled),
  });
}

/**
 * 3. Discoverable commodities list (sorted, searchable)
 */
export function useAvailableCommodities(search = '') {
  return useQuery({
    queryKey: ['market-prices', 'commodities', search],
    queryFn: () => marketPriceService.getCommodities(search),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * 4. List of all Indian States
 */
export function useIndianStates() {
  return useQuery({
    queryKey: ['market-prices', 'states'],
    queryFn: () => marketPriceService.getStates(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * 5. Districts for a State
 */
export function useStateDistricts(state = 'Uttar Pradesh') {
  return useQuery({
    queryKey: ['market-prices', 'districts', state],
    queryFn: () => marketPriceService.getDistricts(state),
    staleTime: 1000 * 60 * 60 * 12,
    enabled: Boolean(state),
  });
}

/**
 * 6. Mandis for a State and District
 */
export function useDistrictMandis(state = 'Uttar Pradesh', district = '') {
  return useQuery({
    queryKey: ['market-prices', 'mandis', state, district],
    queryFn: () => marketPriceService.getMandis(state, district),
    staleTime: 1000 * 60 * 30,
    enabled: Boolean(state),
  });
}

/**
 * 7. Backward-compatible useMarketPriceTrends (delegates to getMarketPrices)
 */
export function useMarketPriceTrends({
  crop = 'Tomato',
  commodity,
  state = 'Uttar Pradesh',
  district = '',
  market = '',
  days = 30,
  enabled = true,
} = {}) {
  const targetCrop = commodity || crop || 'Tomato';
  return useQuery({
    queryKey: ['market-prices', 'trends-compat', targetCrop, state, district, market, days],
    queryFn: () =>
      marketPriceService.getMarketPrices({
        commodity: targetCrop,
        crop: targetCrop,
        state,
        district,
        market,
        days,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(enabled),
  });
}

/**
 * 8. Backward-compatible useAvailableLocations
 */
export function useAvailableLocations({ state = 'Uttar Pradesh', district = 'Varanasi' } = {}) {
  return useQuery({
    queryKey: ['market-prices', 'locations', state, district],
    queryFn: () => marketPriceService.getLocations({ state, district }),
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * 9. Multi-crop live rates overview for ticker
 */
export function useMarketOverview({ state = 'Uttar Pradesh', district = '' } = {}) {
  return useQuery({
    queryKey: ['market-prices', 'overview', state, district],
    queryFn: () => marketPriceService.getOverview({ state, district }),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
  });
}

/**
 * 10. Market-wise comparison for a commodity in a state/district
 */
export function useMarketComparison({ commodity = 'Tomato', state = 'Uttar Pradesh', district = '', enabled = true } = {}) {
  return useQuery({
    queryKey: ['market-prices', 'comparison', commodity, state, district],
    queryFn: () => marketPriceService.getMarketComparison({ commodity, state, district }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(enabled && commodity),
  });
}

/**
 * 11. Mutation to trigger manual upstream sync
 */
export function useSyncMarketPrices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => marketPriceService.syncPrices(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-prices'] });
    },
  });
}

export default useLiveMarketPrices;

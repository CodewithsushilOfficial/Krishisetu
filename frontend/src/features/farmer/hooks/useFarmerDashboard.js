import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import farmerService from '../services/farmerService.js';

export function useFarmerSummary() {
  return useQuery({
    queryKey: ['farmer', 'summary'],
    queryFn: farmerService.getSummary,
    staleTime: 1000 * 60 * 3, // 3 mins
  });
}

export function useFarmerProduce(status = 'all') {
  return useQuery({
    queryKey: ['farmer', 'produce', status],
    queryFn: () => farmerService.getProduce(status),
    staleTime: 1000 * 60 * 2,
  });
}

export function useFarmerMarketPrices(cropId = null, period = '30d') {
  return useQuery({
    queryKey: ['farmer', 'market-prices', cropId, period],
    queryFn: () => farmerService.getMarketPrices(cropId || undefined, period),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFarmerOrders() {
  return useQuery({
    queryKey: ['farmer', 'orders'],
    queryFn: farmerService.getOrders,
    staleTime: 1000 * 60 * 2,
  });
}

export function useFarmerHarvests() {
  return useQuery({
    queryKey: ['farmer', 'harvests'],
    queryFn: farmerService.getHarvests,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFarmerEarnings(period = '6m') {
  return useQuery({
    queryKey: ['farmer', 'earnings', period],
    queryFn: () => farmerService.getEarnings(period),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFarmerWeather() {
  return useQuery({
    queryKey: ['farmer', 'weather'],
    queryFn: farmerService.getWeather,
    staleTime: 1000 * 60 * 15,
  });
}

export function useFarmerInsights() {
  return useQuery({
    queryKey: ['farmer', 'insights'],
    queryFn: farmerService.getAiInsights,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAddProduceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduce) => farmerService.createProduce(newProduce),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'produce'] });
    },
  });
}

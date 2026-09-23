import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import farmerService from '../services/farmerService.js';

// 1. Dashboard
export function useFarmerDashboard() {
  return useQuery({
    queryKey: ['farmer', 'dashboard'],
    queryFn: farmerService.getDashboardSummary,
    staleTime: 1000 * 60 * 3,
  });
}

// 2. Farms
export function useFarmerFarms(params = {}) {
  return useQuery({
    queryKey: ['farmer', 'farms', params],
    queryFn: () => farmerService.getFarms(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFarmerFarm(farmId) {
  return useQuery({
    queryKey: ['farmer', 'farm', farmId],
    queryFn: () => farmerService.getFarmById(farmId),
    enabled: Boolean(farmId),
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: farmerService.createFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'farms'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ farmId, data }) => farmerService.updateFarm(farmId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'farms'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'farm'] });
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: farmerService.deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'farms'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

// 3. Crops
export function useFarmerCrops() {
  return useQuery({
    queryKey: ['farmer', 'crops'],
    queryFn: farmerService.getCrops,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFarmerCrop(cropId) {
  return useQuery({
    queryKey: ['farmer', 'crop', cropId],
    queryFn: () => farmerService.getCropById(cropId),
    enabled: Boolean(cropId),
  });
}

export function useAddCrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: farmerService.addCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'crops'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

export function useFarmerHarvests() {
  return useQuery({
    queryKey: ['farmer', 'harvests'],
    queryFn: farmerService.getHarvests,
    staleTime: 1000 * 60 * 10,
  });
}

// 4. Produce
export function useFarmerProduce(params = {}) {
  return useQuery({
    queryKey: ['farmer', 'produce', params],
    queryFn: () => farmerService.getProduce(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useFarmerProduceDetail(produceId) {
  return useQuery({
    queryKey: ['farmer', 'produce', produceId],
    queryFn: () => farmerService.getProduceById(produceId),
    enabled: Boolean(produceId),
  });
}

export function useCreateProduce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: farmerService.createProduce,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'produce'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

export function useUpdateProduce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ produceId, data }) => farmerService.updateProduce(produceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'produce'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

export function useDeleteProduce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: farmerService.deleteProduce,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'produce'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

// 5. Market Prices
export function useFarmerMarketPrices(params = { period: '30d' }) {
  return useQuery({
    queryKey: ['farmer', 'market-prices', params],
    queryFn: () => farmerService.getMarketPrices(params),
    staleTime: 1000 * 60 * 5,
  });
}

// 6. Buyer Demand
export function useFarmerBuyerDemand(params = {}) {
  return useQuery({
    queryKey: ['farmer', 'buyer-demand', params],
    queryFn: () => farmerService.getBuyerDemand(params),
    staleTime: 1000 * 60 * 3,
  });
}

export function useFarmerBuyerDemandDetail(demandId) {
  return useQuery({
    queryKey: ['farmer', 'buyer-demand', demandId],
    queryFn: () => farmerService.getBuyerDemandById(demandId),
    enabled: Boolean(demandId),
  });
}

// 7. Orders
export function useFarmerOrders(params = {}) {
  return useQuery({
    queryKey: ['farmer', 'orders', params],
    queryFn: () => farmerService.getOrders(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useFarmerOrderDetail(orderId) {
  return useQuery({
    queryKey: ['farmer', 'order', orderId],
    queryFn: () => farmerService.getOrderById(orderId),
    enabled: Boolean(orderId),
  });
}

// 8. Payments
export function useFarmerPayments(params = {}) {
  return useQuery({
    queryKey: ['farmer', 'payments', params],
    queryFn: () => farmerService.getPayments(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFarmerPaymentDetail(paymentId) {
  return useQuery({
    queryKey: ['farmer', 'payment', paymentId],
    queryFn: () => farmerService.getPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });
}

// 9. AI Insights
export function useFarmerAiInsights() {
  return useQuery({
    queryKey: ['farmer', 'ai-insights'],
    queryFn: farmerService.getAiInsights,
    staleTime: 1000 * 60 * 10,
  });
}

export function useRefreshAiInsights() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: farmerService.refreshAiInsights,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'ai-insights'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'dashboard'] });
    },
  });
}

// 10. Weather
export function useFarmerWeather() {
  return useQuery({
    queryKey: ['farmer', 'weather'],
    queryFn: farmerService.getWeather,
    staleTime: 1000 * 60 * 15,
  });
}

export function useFarmerWeatherForecast() {
  return useQuery({
    queryKey: ['farmer', 'weather-forecast'],
    queryFn: farmerService.getWeatherForecast,
    staleTime: 1000 * 60 * 15,
  });
}

// 11. Messages
export function useFarmerMessages() {
  return useQuery({
    queryKey: ['farmer', 'messages'],
    queryFn: farmerService.getMessages,
    staleTime: 1000 * 30, // 30s
  });
}

export function useFarmerMessageConversation(conversationId) {
  return useQuery({
    queryKey: ['farmer', 'conversation', conversationId],
    queryFn: () => farmerService.getMessageConversation(conversationId),
    enabled: Boolean(conversationId),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, data }) => farmerService.sendMessage(conversationId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['farmer', 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['farmer', 'conversation', variables.conversationId] });
    },
  });
}

// 12. Notifications
export function useFarmerNotificationCount() {
  return useQuery({
    queryKey: ['farmer', 'notifications', 'unread-count'],
    queryFn: farmerService.getUnreadNotificationCount,
    staleTime: 1000 * 60,
  });
}

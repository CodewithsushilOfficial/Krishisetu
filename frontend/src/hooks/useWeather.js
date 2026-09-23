import { useQuery } from '@tanstack/react-query';
import weatherService from '../services/weatherService.js';
import { useWeatherStore } from '../stores/weatherStore.js';

export function useWeather(overrideLat = null, overrideLon = null, overrideName = null) {
  const storeLocation = useWeatherStore((state) => state.location);
  const permissionState = useWeatherStore((state) => state.permissionState);
  const requestBrowserLocation = useWeatherStore((state) => state.requestBrowserLocation);

  const latitude = overrideLat ?? storeLocation?.latitude;
  const longitude = overrideLon ?? storeLocation?.longitude;
  const locationName = overrideName ?? storeLocation?.formatted;

  const query = useQuery({
    queryKey: ['weather', latitude, longitude, locationName],
    queryFn: () => weatherService.getForecast(latitude, longitude, { locationName }),
    enabled: latitude != null && longitude != null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  return {
    weather: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    location: storeLocation,
    permissionState,
    requestBrowserLocation,
  };
}

export default useWeather;

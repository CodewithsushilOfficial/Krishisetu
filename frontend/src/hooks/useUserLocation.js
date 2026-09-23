import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'krishisetu_user_location';

export function useUserLocation(initialState = 'Uttar Pradesh', initialDistrict = 'Varanasi') {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      state: initialState,
      district: initialDistrict,
      city: initialDistrict,
      isGps: false,
    };
  });

  const [mode, setMode] = useState(location.isGps ? 'CURRENT' : 'MANUAL');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to save location
  const saveLocation = useCallback((loc) => {
    setLocation(loc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Request browser geolocation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setMode('MANUAL');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode using free OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};

            const detectedState = addr.state || 'Uttar Pradesh';
            let detectedDistrict =
              addr.state_district ||
              addr.county ||
              addr.district ||
              addr.city ||
              addr.town ||
              initialDistrict;

            // Remove suffix like " District"
            detectedDistrict = detectedDistrict.replace(/\s+District$/i, '').trim();

            const newLoc = {
              state: detectedState,
              district: detectedDistrict,
              city: addr.city || addr.town || detectedDistrict,
              latitude,
              longitude,
              isGps: true,
            };

            saveLocation(newLoc);
            setMode('CURRENT');
          } else {
            throw new Error('Reverse geocoding failed');
          }
        } catch (err) {
          setError('Could not detect exact city name. Using default location.');
          setMode('MANUAL');
        } finally {
          setIsLoading(false);
        }
      },
      (geoErr) => {
        setIsLoading(false);
        setError(geoErr.message || 'Location access denied');
        setMode('MANUAL');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [initialDistrict, saveLocation]);

  // Set manual location
  const setManualLocation = useCallback(
    (state, district) => {
      const newLoc = {
        state,
        district,
        city: district,
        isGps: false,
      };
      saveLocation(newLoc);
      setMode('MANUAL');
    },
    [saveLocation]
  );

  return {
    location,
    mode,
    setMode,
    isLoading,
    error,
    requestLocation,
    setManualLocation,
  };
}

export default useUserLocation;

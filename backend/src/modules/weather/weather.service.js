import axios from 'axios';

// In-memory cache for weather and geocoding to prevent excessive external calls
const weatherCache = new Map();
const geocodeCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'sun', severity: 'normal' },
  1: { label: 'Mainly Clear', icon: 'sun-cloud', severity: 'normal' },
  2: { label: 'Partly Cloudy', icon: 'cloud-sun', severity: 'normal' },
  3: { label: 'Overcast', icon: 'cloud', severity: 'normal' },
  45: { label: 'Foggy', icon: 'cloud-fog', severity: 'moderate' },
  48: { label: 'Depositing Rime Fog', icon: 'cloud-fog', severity: 'moderate' },
  51: { label: 'Light Drizzle', icon: 'cloud-drizzle', severity: 'normal' },
  53: { label: 'Moderate Drizzle', icon: 'cloud-drizzle', severity: 'normal' },
  55: { label: 'Dense Drizzle', icon: 'cloud-drizzle', severity: 'moderate' },
  56: { label: 'Light Freezing Drizzle', icon: 'cloud-snow', severity: 'moderate' },
  57: { label: 'Dense Freezing Drizzle', icon: 'cloud-snow', severity: 'high' },
  61: { label: 'Slight Rain', icon: 'cloud-rain', severity: 'normal' },
  63: { label: 'Moderate Rain', icon: 'cloud-rain', severity: 'moderate' },
  65: { label: 'Heavy Rain', icon: 'cloud-rain-heavy', severity: 'high' },
  66: { label: 'Light Freezing Rain', icon: 'cloud-snow', severity: 'moderate' },
  67: { label: 'Heavy Freezing Rain', icon: 'cloud-snow', severity: 'high' },
  71: { label: 'Slight Snow Fall', icon: 'cloud-snow', severity: 'moderate' },
  73: { label: 'Moderate Snow Fall', icon: 'cloud-snow', severity: 'moderate' },
  75: { label: 'Heavy Snow Fall', icon: 'cloud-snow', severity: 'high' },
  77: { label: 'Snow Grains', icon: 'cloud-snow', severity: 'moderate' },
  80: { label: 'Slight Rain Showers', icon: 'cloud-rain', severity: 'normal' },
  81: { label: 'Moderate Rain Showers', icon: 'cloud-rain', severity: 'moderate' },
  82: { label: 'Violent Rain Showers', icon: 'cloud-rain-heavy', severity: 'high' },
  85: { label: 'Slight Snow Showers', icon: 'cloud-snow', severity: 'moderate' },
  86: { label: 'Heavy Snow Showers', icon: 'cloud-snow', severity: 'high' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning', severity: 'high' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'cloud-lightning', severity: 'high' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'cloud-lightning', severity: 'high' },
};

export class WeatherService {
  /**
   * Helper: Round coordinates to 3 decimals (~100m) for effective caching
   */
  static getCacheKey(lat, lon) {
    return `${Number(lat).toFixed(3)}_${Number(lon).toFixed(3)}`;
  }

  /**
   * Resolve condition metadata from WMO weather code
   */
  static getWeatherCondition(code) {
    return WMO_CODE_MAP[code] || { label: 'Partly Cloudy', icon: 'cloud-sun', severity: 'normal' };
  }

  /**
   * Reverse Geocode coordinates to human-readable address
   */
  static async reverseGeocode(latitude, longitude) {
    const cacheKey = this.getCacheKey(latitude, longitude);
    const cached = geocodeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS * 12) {
      return cached.data;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
        },
        headers: {
          'User-Agent': 'KrishiSetu-Agriculture-Platform/1.0',
        },
        timeout: 4000,
      });

      const addr = response.data?.address || {};
      const result = {
        city: addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Local Farm',
        district: addr.state_district || addr.county || addr.district || '',
        state: addr.state || '',
        country: addr.country || 'India',
        postcode: addr.postcode || '',
        formatted: [
          addr.city || addr.town || addr.village || addr.suburb,
          addr.state_district || addr.state,
        ].filter(Boolean).join(', ') || 'Current Location',
      };

      geocodeCache.set(cacheKey, { timestamp: Date.now(), data: result });
      return result;
    } catch {
      // Graceful fallback without failing the weather payload
      return {
        city: 'Local Area',
        district: '',
        state: '',
        country: 'India',
        formatted: `${Number(latitude).toFixed(2)}°N, ${Number(longitude).toFixed(2)}°E`,
      };
    }
  }

  /**
   * Search location by name (city/district/state) via Open-Meteo Geocoding API
   */
  static async searchLocation(query) {
    if (!query || query.trim().length < 2) return [];

    const trimmed = query.trim().toLowerCase();
    const cached = geocodeCache.get(`query_${trimmed}`);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS * 12) {
      return cached.data;
    }

    try {
      const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: trimmed,
          count: 10,
          language: 'en',
          format: 'json',
        },
        timeout: 4000,
      });

      const items = (response.data?.results || []).map((item) => ({
        id: item.id,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        country: item.country || 'India',
        countryCode: item.country_code,
        state: item.admin1 || '',
        district: item.admin2 || item.admin3 || '',
        timezone: item.timezone || 'Asia/Kolkata',
        formatted: [item.name, item.admin2, item.admin1].filter(Boolean).join(', '),
      }));

      geocodeCache.set(`query_${trimmed}`, { timestamp: Date.now(), data: items });
      return items;
    } catch (err) {
      console.warn('Geocoding search error:', err.message);
      return [];
    }
  }

  /**
   * Deterministic generation of agricultural weather insights
   */
  static generateWeatherInsights({ current, daily, hourly }) {
    const insights = [];

    const next24hRainProbMax = hourly.slice(0, 24).reduce((max, h) => Math.max(max, h.rainProbability || 0), 0);
    const next24hRainSum = hourly.slice(0, 24).reduce((sum, h) => sum + (h.rain || 0), 0);
    const maxTempToday = daily[0]?.maxTemp ?? current.temperature;
    const currentWind = current.windSpeed;
    const currentHumidity = current.humidity;

    // 1. Rain / Irrigation Insight
    if (next24hRainProbMax >= 60 || next24hRainSum > 5) {
      insights.push({
        type: 'IRRIGATION',
        severity: 'ALERT',
        title: 'Pause Scheduled Irrigation',
        description: `Precipitation probability is elevated (${next24hRainProbMax}% chance, ~${next24hRainSum.toFixed(1)}mm). Defer canal and tubewell watering to prevent waterlogging and root asphyxiation.`,
      });
      insights.push({
        type: 'SPRAYING',
        severity: 'WARNING',
        title: 'Postpone Foliar Chemical Sprays',
        description: 'Imminent rainfall risks washing away pesticide and fertilizer applications. Reschedule foliar sprays after precipitation clears.',
      });
      insights.push({
        type: 'STORAGE',
        severity: 'WARNING',
        title: 'Shield Harvested Produce in Storage',
        description: 'Ensure freshly harvested grains, pulses, or tubers are moved to covered sheds and stacked on wooden pallets to prevent dampness.',
      });
    } else if (next24hRainProbMax <= 20 && maxTempToday > 32) {
      insights.push({
        type: 'IRRIGATION',
        severity: 'INFO',
        title: 'Maintain Regular Irrigation Schedules',
        description: `Dry weather with high daytime temperatures (${maxTempToday}°C). Ensure timely morning or evening irrigation to replenish evapotranspiration losses.`,
      });
      insights.push({
        type: 'SPRAYING',
        severity: 'POSITIVE',
        title: 'Optimal Spray Window Available',
        description: 'Low wind and clear skies provide an ideal window for pest management and micronutrient application.',
      });
    } else {
      insights.push({
        type: 'FIELD_OPERATIONS',
        severity: 'INFO',
        title: 'Favorable Field Conditions',
        description: 'Microclimate indicators support routine tilling, weeding, and intercultural field operations.',
      });
    }

    // 2. Heat Stress Insight
    if (maxTempToday >= 38) {
      insights.push({
        type: 'HEAT_STRESS',
        severity: 'ALERT',
        title: 'Extreme Heat Stress Advisory',
        description: `Peak temperatures approaching ${maxTempToday}°C. Increase irrigation frequency for horticulture crops and provide shading where feasible.`,
      });
    }

    // 3. Wind Insight
    if (currentWind >= 28) {
      insights.push({
        type: 'WIND_PRECAUTION',
        severity: 'WARNING',
        title: 'High Wind Precaution',
        description: `Wind gusts recorded at ${currentWind} km/h. Inspect polyhouse covers, stake tall crops (banana, sugarcane, maize), and halt spray equipment.`,
      });
    }

    // 4. Humidity / Fungal Risk
    if (currentHumidity >= 80 && current.temperature >= 22) {
      insights.push({
        type: 'DISEASE_WATCH',
        severity: 'WARNING',
        title: 'Elevated Fungal Pathogen Risk',
        description: `Relative humidity is high (${currentHumidity}%). Inspect plots for powdery mildew, blight, and fungal spores. Ensure field drainage channels are unobstructed.`,
      });
    }

    return insights;
  }

  /**
   * Deterministic weather alert detection
   */
  static generateWeatherAlerts({ current, daily, hourly }) {
    const alerts = [];
    const next24Hours = hourly.slice(0, 24);
    const rainSum24h = next24Hours.reduce((sum, h) => sum + (h.rain || 0), 0);
    const maxRainProb24h = next24Hours.reduce((max, h) => Math.max(max, h.rainProbability || 0), 0);
    const maxWind24h = next24Hours.reduce((max, h) => Math.max(max, h.windSpeed || 0), 0);

    // Severe Thunderstorm Check
    if ([95, 96, 99].includes(current.weatherCode)) {
      alerts.push({
        id: 'alert-thunderstorm',
        severity: 'HIGH',
        title: 'Severe Thunderstorm & Lightning Warning',
        message: 'Thunderstorm activity detected in your microclimate zone. Farmers and field workers should immediately seek shelter and avoid open fields.',
        category: 'SAFETY',
      });
    }

    // Heavy Rainfall Alert
    if (rainSum24h >= 25 || maxRainProb24h >= 80 || [65, 82].includes(current.weatherCode)) {
      alerts.push({
        id: 'alert-heavy-rain',
        severity: 'HIGH',
        title: 'Heavy Rainfall Warning',
        message: `Substantial precipitation expected (up to ${Math.round(rainSum24h)}mm in 24 hours). Clear drainage channels and protect open harvest lots.`,
        category: 'PRECIPITATION',
      });
    }

    // Heatwave Alert
    if (daily[0]?.maxTemp >= 40 || current.temperature >= 40) {
      alerts.push({
        id: 'alert-heatwave',
        severity: 'HIGH',
        title: 'Heatwave Advisory',
        message: 'Extreme daytime temperatures forecast. Safeguard nursery seedlings, replenish livestock water, and avoid afternoon field labor.',
        category: 'TEMPERATURE',
      });
    }

    // Strong Wind Alert
    if (maxWind24h >= 35 || current.windSpeed >= 35) {
      alerts.push({
        id: 'alert-strong-wind',
        severity: 'MODERATE',
        title: 'Strong Gusts Advisory',
        message: `Wind gusts exceeding ${Math.round(maxWind24h)} km/h expected. Secure loose structural tarpaulins and nursery tunnels.`,
        category: 'WIND',
      });
    }

    return alerts;
  }

  /**
   * Main: Fetch live weather from Open-Meteo and normalize response
   */
  static async getWeatherData({ latitude, longitude, timezone = 'auto', locationName }) {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error('Invalid latitude. Must be between -90 and 90.');
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      throw new Error('Invalid longitude. Must be between -180 and 180.');
    }

    const cacheKey = this.getCacheKey(lat, lon);
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // 1. Concurrently fetch Open-Meteo telemetry & Reverse Geocode
    const weatherPromise = axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation',
          'rain',
          'weather_code',
          'cloud_cover',
          'wind_speed_10m',
          'wind_direction_10m',
          'uv_index',
          'dew_point_2m',
        ].join(','),
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation_probability',
          'precipitation',
          'rain',
          'weather_code',
          'wind_speed_10m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'precipitation_probability_max',
          'sunrise',
          'sunset',
        ].join(','),
        timezone: timezone || 'auto',
        forecast_days: 7,
      },
      timeout: 12000,
    });

    const geoPromise = locationName
      ? Promise.resolve({ city: locationName, formatted: locationName })
      : this.reverseGeocode(lat, lon).catch(() => ({
          city: 'Local Area',
          formatted: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        }));

    const [weatherRes, geoInfo] = await Promise.all([weatherPromise, geoPromise]);

    const raw = weatherRes.data;
    const currentData = raw.current || {};
    const hourlyData = raw.hourly || {};
    const dailyData = raw.daily || {};

    const currentWeatherCode = currentData.weather_code ?? 0;
    const currentCondition = this.getWeatherCondition(currentWeatherCode);

    // Format Current Weather
    const current = {
      temperature: Math.round(currentData.temperature_2m ?? 0),
      feelsLike: Math.round(currentData.apparent_temperature ?? currentData.temperature_2m ?? 0),
      humidity: Math.round(currentData.relative_humidity_2m ?? 0),
      precipitation: Number((currentData.precipitation ?? 0).toFixed(1)),
      rain: Number((currentData.rain ?? 0).toFixed(1)),
      windSpeed: Math.round(currentData.wind_speed_10m ?? 0),
      windDirection: Math.round(currentData.wind_direction_10m ?? 0),
      weatherCode: currentWeatherCode,
      condition: currentCondition.label,
      conditionIcon: currentCondition.icon,
      conditionSeverity: currentCondition.severity,
      uvIndex: Number((currentData.uv_index ?? 0).toFixed(1)),
      dewPoint: Math.round(currentData.dew_point_2m ?? 0),
      cloudCover: Math.round(currentData.cloud_cover ?? 0),
    };

    // Format Next 24 Hours
    const hourly = [];
    const hourlyTimes = hourlyData.time || [];
    const currentTimeIso = currentData.time || new Date().toISOString();
    
    // Find index corresponding to current hour or start from 0
    let startIndex = hourlyTimes.findIndex((t) => t >= currentTimeIso.slice(0, 13));
    if (startIndex < 0) startIndex = 0;
    const sliceCount = 24;

    for (let i = startIndex; i < Math.min(startIndex + sliceCount, hourlyTimes.length); i++) {
      const code = hourlyData.weather_code?.[i] ?? 0;
      const cond = this.getWeatherCondition(code);
      const timeStr = hourlyTimes[i];
      const hourDate = new Date(timeStr);
      const displayHour = hourDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      });

      hourly.push({
        time: timeStr,
        displayTime: displayHour,
        temperature: Math.round(hourlyData.temperature_2m?.[i] ?? 0),
        humidity: Math.round(hourlyData.relative_humidity_2m?.[i] ?? 0),
        rainProbability: Math.round(hourlyData.precipitation_probability?.[i] ?? 0),
        rain: Number((hourlyData.rain?.[i] ?? hourlyData.precipitation?.[i] ?? 0).toFixed(1)),
        windSpeed: Math.round(hourlyData.wind_speed_10m?.[i] ?? 0),
        weatherCode: code,
        condition: cond.label,
        icon: cond.icon,
      });
    }

    // Format 7-Day Daily Forecast
    const daily = [];
    const dailyTimes = dailyData.time || [];
    for (let i = 0; i < dailyTimes.length; i++) {
      const code = dailyData.weather_code?.[i] ?? 0;
      const cond = this.getWeatherCondition(code);
      const dayDate = new Date(dailyTimes[i]);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayLabel = isToday
        ? 'Today'
        : isTomorrow
        ? 'Tomorrow'
        : dayDate.toLocaleDateString('en-US', { weekday: 'short' });

      daily.push({
        date: dailyTimes[i],
        day: dayLabel,
        weatherCode: code,
        condition: cond.label,
        icon: cond.icon,
        minTemp: Math.round(dailyData.temperature_2m_min?.[i] ?? 0),
        maxTemp: Math.round(dailyData.temperature_2m_max?.[i] ?? 0),
        rainProbability: Math.round(dailyData.precipitation_probability_max?.[i] ?? 0),
        rainSum: Number((dailyData.precipitation_sum?.[i] ?? 0).toFixed(1)),
        sunrise: dailyData.sunrise?.[i] || null,
        sunset: dailyData.sunset?.[i] || null,
      });
    }

    // Location info
    const resolvedLocation = {
      latitude: lat,
      longitude: lon,
      city: locationName || geoInfo?.city || 'Local Farm',
      district: geoInfo?.district || '',
      state: geoInfo?.state || '',
      country: geoInfo?.country || 'India',
      formatted: locationName || geoInfo?.formatted || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
    };

    // Calculate Alerts and Agricultural Insights
    const alerts = this.generateWeatherAlerts({ current, daily, hourly });
    const insights = this.generateWeatherInsights({ current, daily, hourly });

    const normalized = {
      location: resolvedLocation,
      current,
      hourly,
      daily,
      alerts,
      insights,
      attribution: {
        provider: 'Open-Meteo',
        license: 'CC BY 4.0',
        url: 'https://open-meteo.com/',
      },
      updatedAt: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: normalized });
    return normalized;
  }
}

export default WeatherService;

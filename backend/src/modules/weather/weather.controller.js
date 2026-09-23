import { z } from 'zod';
import WeatherService from './weather.service.js';

const coordinateQuerySchema = z.object({
  latitude: z.coerce.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.coerce.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  timezone: z.string().optional().default('auto'),
  locationName: z.string().optional(),
});

const searchQuerySchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
});

export class WeatherController {
  /**
   * GET /api/v1/weather/current
   * Returns current microclimate telemetry
   */
  static async getCurrentWeather(req, res, next) {
    try {
      const parsed = coordinateQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid coordinate parameters',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const weather = await WeatherService.getWeatherData(parsed.data);
      return res.status(200).json({
        status: 'success',
        data: {
          location: weather.location,
          current: weather.current,
          alerts: weather.alerts,
          insights: weather.insights,
          updatedAt: weather.updatedAt,
          attribution: weather.attribution,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/weather/forecast
   * Returns comprehensive weather dataset (current, 24h hourly, 7-day daily, alerts, insights)
   */
  static async getForecast(req, res, next) {
    try {
      const parsed = coordinateQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid coordinate parameters',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const weather = await WeatherService.getWeatherData(parsed.data);
      return res.status(200).json({
        status: 'success',
        data: weather,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/weather/hourly
   * Returns 24-hour hourly forecast
   */
  static async getHourlyForecast(req, res, next) {
    try {
      const parsed = coordinateQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid coordinate parameters',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const weather = await WeatherService.getWeatherData(parsed.data);
      return res.status(200).json({
        status: 'success',
        data: {
          location: weather.location,
          hourly: weather.hourly,
          updatedAt: weather.updatedAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/weather/daily
   * Returns 7-day daily forecast
   */
  static async getDailyForecast(req, res, next) {
    try {
      const parsed = coordinateQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid coordinate parameters',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const weather = await WeatherService.getWeatherData(parsed.data);
      return res.status(200).json({
        status: 'success',
        data: {
          location: weather.location,
          daily: weather.daily,
          updatedAt: weather.updatedAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/weather/search
   * Search location by query string
   */
  static async searchLocation(req, res, next) {
    try {
      const parsed = searchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Query must be at least 2 characters',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const results = await WeatherService.searchLocation(parsed.data.query);
      return res.status(200).json({
        status: 'success',
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/weather/reverse-geocode
   * Convert coordinates to human readable address
   */
  static async reverseGeocode(req, res, next) {
    try {
      const parsed = coordinateQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid coordinate parameters',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const result = await WeatherService.reverseGeocode(parsed.data.latitude, parsed.data.longitude);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default WeatherController;

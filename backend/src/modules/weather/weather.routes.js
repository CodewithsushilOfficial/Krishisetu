import { Router } from 'express';
import WeatherController from './weather.controller.js';

const weatherRouter = Router();

// Public / Authenticated weather telemetry routes
weatherRouter.get('/current', WeatherController.getCurrentWeather);
weatherRouter.get('/forecast', WeatherController.getForecast);
weatherRouter.get('/hourly', WeatherController.getHourlyForecast);
weatherRouter.get('/daily', WeatherController.getDailyForecast);
weatherRouter.get('/search', WeatherController.searchLocation);
weatherRouter.get('/reverse-geocode', WeatherController.reverseGeocode);

export default weatherRouter;

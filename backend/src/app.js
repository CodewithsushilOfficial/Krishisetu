import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import requestIdMiddleware from './middleware/requestId.js';
import requestLoggingMiddleware from './middleware/logging.js';
import errorHandler from './middleware/errorHandler.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import apiRouter from './routes/api.js';
import marketPriceRouter from './modules/market-prices/marketPrice.routes.js';

export function createApp() {
  const app = express();

  // Security Headers via Helmet
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        return callback(new Error('CORS policy: origin not allowed'), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  // Request Correlation & ID
  app.use(requestIdMiddleware);

  // Body Parsing Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Structured Request Logging
  app.use(requestLoggingMiddleware);

  // Mount API Version 1
  app.use('/api/v1', apiRouter);
  app.use('/api/market-prices', marketPriceRouter);

  // API 404 Not Found Handler
  app.use(notFoundHandler);

  // Centralized Error Handling Handler
  app.use(errorHandler);

  return app;
}

export default createApp;

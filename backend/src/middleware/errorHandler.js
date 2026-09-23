import env from '../config/env.js';
import logger from '../lib/logger.js';

/**
 * Centralized API Error Handling Middleware
 */
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'API_ERROR');
  const message = err.message || 'An unexpected error occurred';

  // Log server errors with request context
  logger.error('Unhandled API Error', {
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    errorCode,
    errorMessage: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const responseBody = {
    success: false,
    message,
    error: {
      code: errorCode,
      ...(env.NODE_ENV === 'development' && err.details ? { details: err.details } : {}),
      ...(env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(responseBody);
}

export default errorHandler;

import logger from '../lib/logger.js';

/**
 * Structured HTTP Request Logging Middleware
 */
export function requestLoggingMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket?.remoteAddress,
    };

    if (res.statusCode >= 500) {
      logger.error('HTTP Request Failure', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request Client Error', logData);
    } else {
      logger.info('HTTP Request Handled', logData);
    }
  });

  next();
}

export default requestLoggingMiddleware;

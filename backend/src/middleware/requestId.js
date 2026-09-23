import crypto from 'node:crypto';

/**
 * Request ID & Correlation Middleware
 */
export function requestIdMiddleware(req, res, next) {
  const incomingId = req.headers['x-request-id'];
  const requestId = incomingId || `req_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

export default requestIdMiddleware;

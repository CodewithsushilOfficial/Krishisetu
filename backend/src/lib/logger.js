/**
 * Structured Logger for KrishiSetu Backend
 * Enforces sanitization of sensitive credentials (tokens, passwords, keys)
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'jwt',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'secret',
  'r2_secret_access_key',
  'apikey',
  'api_key',
]);

function sanitize(data) {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitize);

  const clean = {};
  for (const [key, val] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      clean[key] = '[REDACTED]';
    } else if (val && typeof val === 'object') {
      clean[key] = sanitize(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level,
    service: 'krishisetu-backend',
    message,
    ...sanitize(meta),
  };
  return JSON.stringify(entry);
}

export const logger = {
  info: (message, meta) => console.log(formatLog('INFO', message, meta)),
  warn: (message, meta) => console.warn(formatLog('WARN', message, meta)),
  error: (message, meta) => console.error(formatLog('ERROR', message, meta)),
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('DEBUG', message, meta));
    }
  },
};

export default logger;

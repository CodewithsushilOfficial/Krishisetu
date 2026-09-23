import { TokenService } from '../modules/auth/token.service.js';
import { AUTH_COOKIES } from '../modules/auth/auth.constants.js';
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js';

/**
 * Authenticate incoming request via JWT Bearer token or persistent session cookie
 */
export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const decoded = TokenService.verifyAccessToken(token);
      req.user = {
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email,
      };
      return next();
    } catch (err) {
      // If access token expired or invalid, and we have a session cookie, fall through to cookie verification
      if (!req.cookies?.[AUTH_COOKIES.REFRESH_TOKEN]) {
        return next(err);
      }
    }
  }

  // Fallback: Verify active session from HttpOnly session/refresh cookie
  const rawRefreshToken = req.cookies?.[AUTH_COOKIES.REFRESH_TOKEN];
  if (rawRefreshToken) {
    try {
      const session = await TokenService.verifySession(rawRefreshToken);
      req.user = {
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
      };
      req.session = session;
      return next();
    } catch (sessionErr) {
      return next(sessionErr);
    }
  }

  return next(new UnauthorizedError('Authentication token required', 'TOKEN_MISSING'));
}

/**
 * Enforce role-based access control
 * @param  {...string} allowedRoles Allowed role names (accepts strings or arrays of strings)
 */
export function requireRole(...allowedRoles) {
  const roles = allowedRoles.flat();
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required', 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access forbidden: required one of [${roles.join(', ')}], current role is [${req.user.role}]`,
          'FORBIDDEN_ROLE'
        )
      );
    }

    next();
  };
}

/**
 * Enforce resource ownership to prevent IDOR / Broken Object Level Authorization (BOLA)
 * @param {Function|string} getOwnerId Function(req) returning ownerId or name of param (default 'userId')
 */
export function requireOwnership(getOwnerId) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required', 'UNAUTHORIZED'));
    }

    // Admins and Control Admins bypass ownership checks for operational management
    if (['ADMIN', 'CONTROL_ADMIN'].includes(req.user.role)) {
      return next();
    }

    const ownerId =
      typeof getOwnerId === 'function'
        ? getOwnerId(req)
        : req.params[getOwnerId || 'userId'] || req.body?.[getOwnerId || 'userId'];

    if (!ownerId || req.user.id !== ownerId) {
      return next(
        new ForbiddenError(
          'You do not have permission to access or modify this resource.',
          'FORBIDDEN_RESOURCE_OWNERSHIP'
        )
      );
    }

    next();
  };
}

export default requireAuth;

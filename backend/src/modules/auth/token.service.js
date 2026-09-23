import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import env from '../../config/env.js';
import prisma from '../../db/prisma.js';
import { AUTH_COOKIES } from './auth.constants.js';
import { UnauthorizedError } from '../../lib/errors.js';

export class TokenService {
  /**
   * Generate signed short-lived JWT access token
   */
  static generateAccessToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET || env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN || '15m',
    });
  }

  /**
   * Create secure persistent session with hashed refresh token
   */
  static async createSession(userId, { ipAddress = null, userAgent = null } = {}) {
    const rawToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // 7 days expiration window
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await prisma.session.create({
      data: {
        userId,
        refreshTokenHash: tokenHash,
        expiresAt,
        ipAddress: ipAddress ? String(ipAddress).slice(0, 255) : null,
        userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
        lastUsedAt: new Date(),
      },
    });

    // Mirror to legacy RefreshToken table for backwards compatibility
    try {
      await prisma.refreshToken.create({
        data: {
          userId,
          token: tokenHash,
          expiresAt,
          revoked: false,
          revokedAt: null,
        },
      });
    } catch {
      // Ignore mirror error if duplicate or table deprecated
    }

    return { rawToken, expiresAt, sessionId: session.id };
  }

  /**
   * Backward-compatible alias for createSession
   */
  static async createRefreshToken(userId, meta = {}) {
    return this.createSession(userId, meta);
  }

  /**
   * Verify and validate JWT access token
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET || env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED');
      }
      throw new UnauthorizedError('Invalid access token', 'TOKEN_INVALID');
    }
  }

  /**
   * Verify session from raw refresh token and return active owner
   */
  static async verifySession(rawToken) {
    if (!rawToken) {
      throw new UnauthorizedError('Refresh token missing', 'TOKEN_MISSING');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Query active session
    let session = await prisma.session.findUnique({
      where: { refreshTokenHash: tokenHash },
      include: {
        user: {
          include: {
            farmerProfile: true,
            fpoProfile: true,
            logisticsProfile: true,
            bulkBuyerProfile: true,
            consumerProfile: true,
          },
        },
      },
    });

    // Fallback to RefreshToken table for pre-migration tokens
    if (!session) {
      const legacyToken = await prisma.refreshToken.findUnique({
        where: { token: tokenHash },
        include: {
          user: {
            include: {
              farmerProfile: true,
              fpoProfile: true,
              logisticsProfile: true,
              bulkBuyerProfile: true,
              consumerProfile: true,
            },
          },
        },
      });

      if (legacyToken) {
        session = {
          id: legacyToken.id,
          userId: legacyToken.userId,
          refreshTokenHash: legacyToken.token,
          expiresAt: legacyToken.expiresAt,
          revokedAt: legacyToken.revokedAt || (legacyToken.revoked ? new Date() : null),
          user: legacyToken.user,
        };
      }
    }

    if (!session) {
      throw new UnauthorizedError('Invalid or unrecognized refresh session', 'TOKEN_INVALID');
    }

    // Allow a 30-second leeway window for concurrent in-flight requests during token rotation
    const isWithinRotationGracePeriod =
      session.revokedAt && Date.now() - new Date(session.revokedAt).getTime() < 30000;

    if ((session.revokedAt && !isWithinRotationGracePeriod) || session.expiresAt < new Date()) {
      throw new UnauthorizedError('Session has expired or been revoked', 'TOKEN_EXPIRED');
    }

    if (session.user.status === 'SUSPENDED' || session.user.status === 'DEACTIVATED') {
      throw new UnauthorizedError('User account is inactive or suspended', 'ACCOUNT_INACTIVE');
    }

    // Touch last used timestamp asynchronously
    prisma.session
      .update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {});

    return session;
  }

  /**
   * Backward-compatible alias for verifySession
   */
  static async verifyRefreshToken(rawToken) {
    return this.verifySession(rawToken);
  }

  /**
   * Revoke a specific session (on logout or rotation)
   */
  static async revokeSession(rawToken) {
    if (!rawToken) return;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const now = new Date();

    await Promise.all([
      prisma.session.updateMany({
        where: { refreshTokenHash: tokenHash, revokedAt: null },
        data: { revokedAt: now },
      }),
      prisma.refreshToken.updateMany({
        where: { token: tokenHash, revoked: false },
        data: { revoked: true, revokedAt: now },
      }),
    ]);
  }

  /**
   * Backward-compatible alias for revokeSession
   */
  static async revokeRefreshToken(rawToken) {
    return this.revokeSession(rawToken);
  }

  /**
   * Revoke all sessions for a user (password reset, security wipe)
   */
  static async revokeAllUserTokens(userId) {
    const now = new Date();
    await Promise.all([
      prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true, revokedAt: now },
      }),
    ]);
  }

  /**
   * Standard cookie options for HTTP-only refresh token
   * Uses Path=/ so session verification works seamlessly across the app
   */
  static getCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
  }

  /**
   * Set refresh token cookie on Express response
   */
  static setRefreshTokenCookie(res, rawToken) {
    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, rawToken, this.getCookieOptions());
  }

  /**
   * Clear refresh token cookie on Express response
   */
  static clearRefreshTokenCookie(res) {
    res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, {
      ...this.getCookieOptions(),
      maxAge: 0,
    });
  }
}

export default TokenService;

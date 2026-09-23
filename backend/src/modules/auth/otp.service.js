import { redis } from '../../lib/redis.js';
import logger from '../../lib/logger.js';
import prisma from '../../db/prisma.js';
import { OTP_CONFIG } from './auth.constants.js';
import { BadRequestError } from '../../lib/errors.js';
import { normalizePhone } from './auth.schema.js';

// In-memory fallback if Redis is temporarily disconnected during tests
const memoryOtpStore = new Map();
const memoryCooldownStore = new Map();

function normalizeIdentifier(identifier) {
  if (!identifier) return '';
  const trimmed = identifier.trim().toLowerCase();
  // Check if it's a mobile number
  if (/^(\+91|91)?[6-9]\d{9}$/.test(trimmed) || /^\d{10}$/.test(trimmed)) {
    return normalizePhone(trimmed);
  }
  return trimmed;
}

export class OtpService {
  /**
   * Generate and store OTP for identifier and purpose
   */
  static async sendOtp(identifier, purpose = 'REGISTRATION') {
    const normId = normalizeIdentifier(identifier);
    const cooldownKey = `krishisetu:otp:cooldown:${purpose}:${normId}`;
    const otpKey = `krishisetu:otp:${purpose}:${normId}`;

    // 1. Check resend cooldown (30s)
    let inCooldown = false;
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const ttl = await redis.ttl(cooldownKey);
        if (ttl > 0) {
          throw new BadRequestError(
            `Please wait ${ttl} seconds before requesting a new OTP.`,
            'RESEND_COOLDOWN',
            { retryAfterSeconds: ttl }
          );
        }
      }
    } catch (err) {
      if (err instanceof BadRequestError) throw err;
      logger.warn('Redis check failed during OTP cooldown, using fallback', { error: err.message });
      const memCool = memoryCooldownStore.get(cooldownKey);
      if (memCool && memCool > Date.now()) {
        const remaining = Math.ceil((memCool - Date.now()) / 1000);
        throw new BadRequestError(
          `Please wait ${remaining} seconds before requesting a new OTP.`,
          'RESEND_COOLDOWN',
          { retryAfterSeconds: remaining }
        );
      }
    }

    // 2. Mock OTP generation
    const otp = OTP_CONFIG.MOCK_OTP; // '123456'
    const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_SECONDS * 1000);
    const otpPayload = {
      otp,
      attempts: 0,
      expiresAt: expiresAt.toISOString(),
      sentAt: new Date().toISOString(),
      purpose,
      identifier: normId,
    };

    // 3. Store in Redis with TTL (5 min = 300s) + set cooldown (30s)
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        await redis.set(otpKey, JSON.stringify(otpPayload), 'EX', OTP_CONFIG.EXPIRY_SECONDS);
        await redis.set(cooldownKey, '1', 'EX', OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
      } else {
        throw new Error('Redis not ready');
      }
    } catch (err) {
      logger.warn('Failed to store OTP in Redis, using memory store', { error: err.message });
      memoryOtpStore.set(otpKey, { ...otpPayload, expiresTimestamp: expiresAt.getTime() });
      memoryCooldownStore.set(
        cooldownKey,
        Date.now() + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000
      );
    }

    logger.info(`Mock OTP generated for [${normId}] purpose [${purpose}]: ${otp}`);

    return {
      success: true,
      identifier: normId,
      purpose,
      expiresInSeconds: OTP_CONFIG.EXPIRY_SECONDS,
      cooldownSeconds: OTP_CONFIG.RESEND_COOLDOWN_SECONDS,
    };
  }

  /**
   * Verify entered OTP against stored state
   */
  static async verifyOtp(identifier, enteredOtp, purpose = 'REGISTRATION') {
    const normId = normalizeIdentifier(identifier);
    const otpKey = `krishisetu:otp:${purpose}:${normId}`;

    let otpData = null;

    // Fetch from Redis or fallback
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const raw = await redis.get(otpKey);
        if (raw) otpData = JSON.parse(raw);
      } else {
        throw new Error('Redis not ready');
      }
    } catch (err) {
      logger.warn('Redis get failed for OTP, falling back to memory', { error: err.message });
      const mem = memoryOtpStore.get(otpKey);
      if (mem && mem.expiresTimestamp > Date.now()) {
        otpData = mem;
      }
    }

    if (!otpData) {
      throw new BadRequestError(
        'OTP has expired or does not exist. Please request a new OTP.',
        'OTP_EXPIRED'
      );
    }

    // Check attempts limit (max 5)
    if (otpData.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
      // Invalidate key
      try {
        if (redis.status === 'ready' || redis.status === 'connect') {
          await redis.del(otpKey);
        }
      } catch {
        // ignore
      }
      memoryOtpStore.delete(otpKey);

      throw new BadRequestError(
        'Maximum OTP verification attempts exceeded. Please request a new OTP.',
        'TOO_MANY_ATTEMPTS'
      );
    }

    // Validate OTP string (backend-controlled)
    if (enteredOtp !== otpData.otp) {
      otpData.attempts += 1;
      const remaining = OTP_CONFIG.MAX_ATTEMPTS - otpData.attempts;

      // Update attempts in storage
      try {
        if (redis.status === 'ready' || redis.status === 'connect') {
          const ttl = await redis.ttl(otpKey);
          if (ttl > 0) {
            await redis.set(otpKey, JSON.stringify(otpData), 'EX', ttl);
          }
        }
      } catch {
        // ignore
      }
      memoryOtpStore.set(otpKey, otpData);

      throw new BadRequestError(
        `Invalid OTP. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Please request a new OTP.'}`,
        'INVALID_OTP',
        { remainingAttempts: remaining }
      );
    }

    // Success! Invalidate OTP immediately to prevent reuse
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        await redis.del(otpKey);
      }
    } catch {
      // ignore
    }
    memoryOtpStore.delete(otpKey);

    // Audit record in PostgreSQL
    const now = new Date();
    try {
      await prisma.otpVerification.create({
        data: {
          identifier: normId,
          purpose,
          expiresAt: new Date(otpData.expiresAt),
          verifiedAt: now,
          attempts: otpData.attempts + 1,
        },
      });
    } catch (auditErr) {
      logger.warn('Failed to record OtpVerification audit log', { error: auditErr.message });
    }

    return {
      success: true,
      verified: true,
      identifier: normId,
      purpose,
      verifiedAt: now,
    };
  }
}

export default OtpService;

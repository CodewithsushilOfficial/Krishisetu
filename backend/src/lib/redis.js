import Redis from 'ioredis';
import env from '../config/env.js';
import logger from './logger.js';

let redisClient = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        if (times > 5) {
          logger.warn('Redis reconnection attempts exceeded maximum limit of 5');
          return null; // Stop retrying automatically to avoid thrashing
        }
        return Math.min(times * 500, 2000);
      },
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready to accept commands');
    });

    redisClient.on('error', (err) => {
      logger.warn('Redis connection event error', { error: err.message });
    });

    redisClient.on('close', () => {
      logger.info('Redis connection closed');
    });
  }
  return redisClient;
}

export const redis = getRedisClient();

/**
 * Checks Redis connectivity
 */
export async function testRedisConnection() {
  try {
    const client = getRedisClient();
    if (client.status === 'wait') {
      await client.connect();
    }
    const pong = await client.ping();
    return { success: pong === 'PONG', status: pong === 'PONG' ? 'connected' : 'unresponsive' };
  } catch (error) {
    logger.warn('Redis health check failed', { error: error.message });
    return { success: false, status: 'disconnected', error: error.message };
  }
}

/**
 * Graceful Redis shutdown
 */
export async function disconnectRedis() {
  if (redisClient && redisClient.status !== 'end') {
    logger.info('Disconnecting Redis client');
    try {
      await redisClient.quit();
    } catch {
      redisClient.disconnect();
    }
    redisClient = null;
  }
}

export default redis;

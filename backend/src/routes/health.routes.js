import { Router } from 'express';
import { testDatabaseConnection } from '../db/prisma.js';
import { testRedisConnection } from '../lib/redis.js';
import { testR2Configuration } from '../lib/storage.js';

const router = Router();

/**
 * General Platform Health Check
 * GET /api/v1/health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'KrishiSetu Backend',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

/**
 * Database Dependency Health Check
 * GET /api/v1/health/db
 */
router.get('/db', async (req, res) => {
  const result = await testDatabaseConnection();
  if (result.success) {
    res.status(200).json({
      success: true,
      service: 'KrishiSetu Backend Database',
      status: 'healthy',
      dependency: 'PostgreSQL',
      details: result,
    });
  } else {
    res.status(503).json({
      success: false,
      service: 'KrishiSetu Backend Database',
      status: 'unhealthy',
      dependency: 'PostgreSQL',
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: result.error,
      },
    });
  }
});

/**
 * Redis Dependency Health Check
 * GET /api/v1/health/redis
 */
router.get('/redis', async (req, res) => {
  const result = await testRedisConnection();
  if (result.success) {
    res.status(200).json({
      success: true,
      service: 'KrishiSetu Backend Redis',
      status: 'healthy',
      dependency: 'Redis',
      details: result,
    });
  } else {
    res.status(503).json({
      success: false,
      service: 'KrishiSetu Backend Redis',
      status: 'unhealthy',
      dependency: 'Redis',
      error: {
        code: 'REDIS_UNAVAILABLE',
        message: result.error,
      },
    });
  }
});

/**
 * Cloudflare R2 Storage Configuration Diagnostics
 * GET /api/v1/health/storage
 */
router.get('/storage', (req, res) => {
  const result = testR2Configuration();
  res.status(200).json({
    success: true,
    service: 'KrishiSetu Backend Storage',
    status: 'healthy',
    dependency: 'Cloudflare R2',
    details: result,
  });
});

export default router;

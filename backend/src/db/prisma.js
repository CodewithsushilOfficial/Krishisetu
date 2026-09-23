import { PrismaClient } from '@prisma/client';
import logger from '../lib/logger.js';

let prismaInstance = null;

export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();

/**
 * Validates database connectivity
 */
export async function testDatabaseConnection() {
  try {
    // Standard fast diagnostic query to verify round-trip DB health
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, status: 'connected' };
  } catch (error) {
    logger.error('Database connectivity test failed', { error: error.message });
    return { success: false, status: 'disconnected', error: error.message };
  }
}

/**
 * Graceful disconnect
 */
export async function disconnectDatabase() {
  if (prismaInstance) {
    logger.info('Disconnecting Prisma database client');
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

export default prisma;

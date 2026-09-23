import { createApp } from './app.js';
import env from './config/env.js';
import logger from './lib/logger.js';
import { disconnectDatabase, testDatabaseConnection } from './db/prisma.js';
import { disconnectRedis, testRedisConnection } from './lib/redis.js';

/* ─── ANSI colour helpers (zero deps) ─── */
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  white:  '\x1b[97m',
  bg:     '\x1b[42m',        // green background
  bgDark: '\x1b[100m',      // dark-grey background
};

function statusLine(label, ok, detail = '') {
  const icon   = ok ? `${c.green}●${c.reset}` : `${c.red}✕${c.reset}`;
  const status = ok ? `${c.green}Connected${c.reset}` : `${c.red}Failed${c.reset}`;
  const extra  = detail ? `  ${c.dim}${detail}${c.reset}` : '';
  return `  ${icon}  ${c.bold}${label.padEnd(12)}${c.reset} ${status}${extra}`;
}

const app = createApp();

const server = app.listen(env.PORT, async () => {
  // Run DB + Redis checks in parallel
  const [db, red] = await Promise.all([
    testDatabaseConnection(),
    testRedisConnection(),
  ]);

  const line  = `${c.dim}${'─'.repeat(48)}${c.reset}`;
  const env_  = env.NODE_ENV === 'production'
    ? `${c.yellow}production${c.reset}`
    : `${c.green}development${c.reset}`;

  console.log(`
${c.bold}${c.green}  ██╗  ██╗██████╗ ██╗███████╗██╗  ██╗██╗${c.reset}
${c.bold}${c.green}  ██║ ██╔╝██╔══██╗██║██╔════╝██║  ██║██║${c.reset}
${c.bold}${c.green}  █████╔╝ ██████╔╝██║███████╗███████║██║${c.reset}
${c.bold}${c.green}  ██╔═██╗ ██╔══██╗██║╚════██║██╔══██║██║${c.reset}
${c.bold}${c.green}  ██║  ██╗██║  ██║██║███████║██║  ██║██║${c.reset}
${c.bold}${c.green}  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ${c.dim}Backend${c.reset}
${line}
${statusLine('HTTP Server', true,  `http://localhost:${env.PORT}/api/v1`)}
${statusLine('PostgreSQL',  db.success,  db.error  || '')}
${statusLine('Redis',       red.success, red.error || '')}
${line}
  ${c.dim}Environment${c.reset}  ${env_}
  ${c.dim}Node.js     ${process.version}${c.reset}
  ${c.dim}PID         ${process.pid}${c.reset}
${line}
  ${c.dim}Press Ctrl+C to stop${c.reset}
`);
});


/**
 * Graceful Shutdown Sequence
 */
let isShuttingDown = false;

async function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  // Force exit after 2 seconds — fast enough for nodemon restarts to not hit EADDRINUSE
  const forceExitTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 2000);
  forceExitTimeout.unref();

  // 1. Stop accepting new HTTP connections
  if (server && server.listening) {
    server.close(async (err) => {
      if (err) {
        logger.error('Error closing HTTP server', { error: err.message });
      } else {
        logger.info('HTTP server closed successfully');
      }

      await cleanupResources();
    });
  } else {
    await cleanupResources();
  }
}

async function cleanupResources() {
  try {
    // 2. Disconnect Redis
    await disconnectRedis();

    // 3. Disconnect Prisma / PostgreSQL
    await disconnectDatabase();

    logger.info('All resources released cleanly. Process exiting.');
    process.exit(0);
  } catch (cleanupError) {
    logger.error('Error during cleanup sequence', { error: cleanupError.message });
    process.exit(1);
  }
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${env.PORT} is already in use. Terminate the existing process or set a different PORT in .env.`);
  } else {
    logger.error('Server error encountered', { error: err.message, code: err.code });
  }
  process.exit(1);
});

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown', { error: err.message, stack: err.stack });
  handleShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

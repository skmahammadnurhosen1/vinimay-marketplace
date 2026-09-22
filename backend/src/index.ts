import { createApp } from './app.js';
import { env } from './config/environment.js';
import { initializeFirebase } from './config/firebase.js';
import { logger } from './utils/logger.js';

async function bootstrap(): Promise<void> {
  logger.info('================================================================');
  logger.info('Starting AutoPartsHub Backend API Engine — Phase 0 Skeleton');
  logger.info('================================================================');

  // 1. Initialize Firebase Admin SDK
  initializeFirebase();

  // 2. Initialize Express Application
  const app = createApp();

  // 3. Start Listening on designated Render PORT
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 AutoPartsHub Backend listening on port ${env.PORT}`);
    logger.info(`🌐 Environment: ${env.NODE_ENV}`);
    logger.info(`🩺 Health endpoint active: http://localhost:${env.PORT}/health`);
    logger.info(`🔌 Versioned API Root: http://localhost:${env.PORT}/api/v1`);
  });

  // 4. Graceful Shutdown Handlers
  const handleShutdown = (signal: string) => {
    logger.warn(`Received ${signal}. Gracefully closing HTTP server...`);
    server.close(() => {
      logger.info('HTTP server closed. Exiting process safely.');
      process.exit(0);
    });

    // Force close after timeout if connections hang
    setTimeout(() => {
      logger.error('Forced shutdown due to active connections timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Fatal bootstrap failure:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});

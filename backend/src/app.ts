import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/environment.js';
import { requestIdMiddleware } from './middlewares/requestId.js';
import { requestLoggerMiddleware } from './middlewares/requestLogger.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { notFoundHandlerMiddleware } from './middlewares/notFoundHandler.js';
import { globalApiRateLimiter } from './middlewares/rateLimiter.js';
import { healthRouter } from './modules/health/health.routes.js';
import { apiRouter } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // 1. Trust reverse proxy (essential for Render / Cloudflare deployments)
  app.set('trust proxy', 1);

  // 2. Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    })
  );

  // 3. Strict CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        const isAllowed = env.CORS_ORIGINS.some((allowedOrigin) => {
          if (allowedOrigin === '*') return true;
          return origin === allowedOrigin || origin.endsWith(allowedOrigin.replace('https://', '.'));
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error(`CORS policy violation: Origin ${origin} not permitted`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Accept'],
      exposedHeaders: ['X-Request-Id'],
      maxAge: 86400, // 24 hours pre-flight caching
    })
  );

  // 4. Body parsers with sensible limits
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // 5. Request tracking and logging
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  // 6. Direct root health endpoint for Render health checks
  app.use('/health', healthRouter);

  // 7. Mount Rate Limiter & Versioned API routes
  app.use('/api/v1', globalApiRateLimiter, apiRouter);

  // 8. 404 Route Not Found Handler
  app.use(notFoundHandlerMiddleware);

  // 9. Central Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}

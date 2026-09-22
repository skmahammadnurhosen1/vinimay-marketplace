import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Capture response completion
  res.on('finish', () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const statusCode = res.statusCode;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    const logMeta = {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode,
      durationMs: duration,
      ip,
      userAgent: req.headers['user-agent'],
    };

    if (statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.originalUrl} ${statusCode} [${duration}ms]`, logMeta);
    } else if (statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.originalUrl} ${statusCode} [${duration}ms]`, logMeta);
    } else {
      logger.info(`HTTP ${req.method} ${req.originalUrl} ${statusCode} [${duration}ms]`, logMeta);
    }
  });

  next();
}

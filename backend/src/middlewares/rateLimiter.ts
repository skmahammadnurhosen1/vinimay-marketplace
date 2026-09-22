import { Request, Response, NextFunction } from 'express';
import { env } from '../config/environment.js';
import { sendError } from '../utils/apiResponse.js';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipInTest?: boolean;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const store = new Map<string, RateLimitStore>();
  const windowMs = options.windowMs || 60000;
  const max = options.max || 100;
  const message = options.message || 'Too many requests from this IP, please try again later.';
  const skipInTest = options.skipInTest !== undefined ? options.skipInTest : true;

  return (req: Request, res: Response, next: NextFunction): void => {
    // In test environment, skip unless explicitly testing rate limiting
    if (skipInTest && env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
      next();
      return;
    }

    const key = (req.ip || req.socket.remoteAddress || 'anonymous').toString();
    const now = Date.now();

    let record = store.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      store.set(key, record);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      next();
      return;
    }

    record.count++;
    const remaining = Math.max(0, max - record.count);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      sendError(res, message, 429, 'RATE_LIMIT_EXCEEDED');
      return;
    }

    next();
  };
}

// Global API rate limiter (300 requests / min)
export const globalApiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
  message: 'API rate limit exceeded. Please slow down your requests.',
});

// Sensitive endpoints rate limiter (30 requests / min for auth, checkout, registration)
export const sensitiveEndpointsRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many sensitive operations requested. Please wait before retrying.',
});

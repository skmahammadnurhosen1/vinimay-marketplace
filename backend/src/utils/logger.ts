import { env } from '../config/environment.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return logLevels[level] >= logLevels[env.LOG_LEVEL];
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'refreshtoken',
  'authorization',
  'secret',
  'apikey',
  'privatekey',
  'creditcard',
  'cvv',
  'cardnumber',
  'otp',
  'pin',
]);

function sanitizeMeta(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMeta);

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lower = key.toLowerCase().replace(/[-_]/g, '');
    if (SENSITIVE_KEYS.has(lower) || lower.includes('password') || lower.includes('token')) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = sanitizeMeta(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

function formatLog(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const sanitized = meta ? sanitizeMeta(meta) : undefined;
  const metaStr = sanitized && Object.keys(sanitized as object).length > 0 ? ` ${JSON.stringify(sanitized)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('debug')) {
      console.debug(formatLog('debug', message, meta));
    }
  },
  info(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('info')) {
      console.info(formatLog('info', message, meta));
    }
  },
  warn(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('warn')) {
      console.warn(formatLog('warn', message, meta));
    }
  },
  error(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog('error')) {
      console.error(formatLog('error', message, meta));
    }
  },
};

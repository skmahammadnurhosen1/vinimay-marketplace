import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env if present
dotenv.config();

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('10000').transform((val) => parseInt(val, 10)),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:3000,https://vinimay-p2p-marketplace.web.app')
    .transform((val) => val.split(',').map((o) => o.trim())),
  FIREBASE_PROJECT_ID: z.string().default('vinimay-p2p-marketplace'),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().default('vinimay-p2p-marketplace.appspot.com'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  RATE_LIMIT_MAX: z.string().default('300').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform((val) => parseInt(val, 10)),
  NOTIFICATION_EMAIL_PROVIDER: z.enum(['mock', 'sendgrid', 'resend', 'ses']).default('mock'),
  NOTIFICATION_SMS_PROVIDER: z.enum(['mock', 'twilio', 'msg91']).default('mock'),
  NOTIFICATION_WHATSAPP_PROVIDER: z.enum(['mock', 'meta', 'gupshup']).default('mock'),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

export type Environment = typeof env;

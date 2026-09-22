import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';
import { env } from '../../config/environment.js';

const startTime = Date.now();

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  service: string;
  version: string;
  uptimeSeconds: number;
  environment: string;
  timestamp: string;
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
  };
  dependencies: {
    firebase: {
      status: 'CONFIGURED' | 'OFFLINE_MODE';
      projectId: string;
    };
  };
}

export function getHealthStatus(_req: Request, res: Response): Response {
  const memoryUsage = process.memoryUsage();

  const healthData: HealthStatus = {
    status: 'UP',
    service: 'autopartshub-backend-api',
    version: '1.0.0',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    memory: {
      rssMb: Math.round((memoryUsage.rss / (1024 * 1024)) * 100) / 100,
      heapTotalMb: Math.round((memoryUsage.heapTotal / (1024 * 1024)) * 100) / 100,
      heapUsedMb: Math.round((memoryUsage.heapUsed / (1024 * 1024)) * 100) / 100,
    },
    dependencies: {
      firebase: {
        status: env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY ? 'CONFIGURED' : 'OFFLINE_MODE',
        projectId: env.FIREBASE_PROJECT_ID,
      },
    },
  };

  return sendSuccess(res, healthData, 200);
}

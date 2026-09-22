import { Router } from 'express';
import { getHealthStatus } from './health.controller.js';

export const healthRouter = Router();

// GET /health and /api/v1/health
healthRouter.get('/', getHealthStatus);

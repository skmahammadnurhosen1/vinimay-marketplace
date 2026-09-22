import { Request, Response } from 'express';
import { sendError } from '../utils/apiResponse.js';

export function notFoundHandlerMiddleware(req: Request, res: Response): void {
  sendError(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    'RESOURCE_NOT_FOUND'
  );
}

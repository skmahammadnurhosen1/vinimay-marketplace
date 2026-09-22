import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, sendError, ApiErrorDetail } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/environment.js';

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Handled operational AppErrors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  // 2. Schema validation errors (Zod)
  if (err instanceof ZodError) {
    const details: ApiErrorDetail[] = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));
    sendError(res, 'Validation error: invalid request payload', 400, 'VALIDATION_ERROR', details);
    return;
  }

  // 3. JSON Syntax error (malformed body)
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    sendError(res, 'Malformed JSON in request body', 400, 'INVALID_JSON');
    return;
  }

  // 4. Unhandled server errors (500)
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
  const errorStack = err instanceof Error ? err.stack : undefined;

  logger.error('Unhandled Exception Caught:', {
    requestId: req.id,
    path: req.originalUrl,
    error: errorMessage,
    stack: errorStack,
  });

  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : errorMessage;

  sendError(res, message, 500, 'INTERNAL_SERVER_ERROR');
}

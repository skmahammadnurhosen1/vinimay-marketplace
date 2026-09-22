import { Response } from 'express';

export interface ApiResponseMeta {
  timestamp: string;
  requestId?: string;
  version?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  meta: ApiResponseMeta;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiErrorDetail[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: ApiErrorDetail[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  pagination?: ApiResponseMeta['pagination']
): Response {
  const meta: ApiResponseMeta = {
    timestamp: new Date().toISOString(),
    requestId: (res.req as { id?: string }).id,
    version: 'v1',
  };

  if (pagination) {
    meta.pagination = pagination;
  }

  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta,
  };

  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: ApiErrorDetail[]
): Response {
  const meta: ApiResponseMeta = {
    timestamp: new Date().toISOString(),
    requestId: (res.req as { id?: string }).id,
    version: 'v1',
  };

  const response: ApiErrorResponse & { code: string } = {
    success: false,
    code,
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
    meta,
  };

  return res.status(statusCode).json(response);
}

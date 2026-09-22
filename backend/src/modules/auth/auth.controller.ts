import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from './auth.service.js';
import { userRepository } from '../users/user.repository.js';
import { sendSuccess, sendError, AppError } from '../../utils/apiResponse.js';

// Request Validation Schemas
export const verifyTokenSchema = z.object({
  idToken: z.string().min(1, 'idToken is required'),
});

export const syncProfileSchema = z.object({
  initialRole: z.enum(['CUSTOMER', 'SELLER', 'MANUFACTURER', 'ADMIN']).optional().default('CUSTOMER'),
  displayName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().optional(),
});

export class AuthController {
  /**
   * GET /api/v1/auth/me
   * Returns authenticated user profile and permissions
   */
  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      return;
    }

    const fullProfile = await userRepository.findById(req.user.uid);

    sendSuccess(res, {
      uid: req.user.uid,
      email: req.user.email,
      role: req.user.role,
      accountStatus: req.user.accountStatus,
      displayName: req.user.displayName,
      emailVerified: req.user.emailVerified,
      phoneVerified: req.user.phoneVerified,
      permissions: req.user.permissions,
      twoFactorEnabled: req.user.twoFactorEnabled,
      twoFactorVerified: req.user.twoFactorVerified,
      profile: fullProfile,
    });
  }

  /**
   * POST /api/v1/auth/verify-token
   * Verifies an ID token and confirms validity
   */
  async verifyToken(req: Request, res: Response): Promise<void> {
    const parsed = verifyTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 'Valid idToken string is required', 400, 'VALIDATION_ERROR');
      return;
    }

    try {
      const decoded = await authService.verifyIdToken(parsed.data.idToken);
      const profile = await authService.getOrCreateUserProfile(decoded);

      sendSuccess(res, {
        valid: true,
        uid: decoded.uid,
        email: decoded.email,
        role: profile.role,
        accountStatus: profile.accountStatus,
        emailVerified: profile.emailVerified,
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.message, error.statusCode, error.code);
        return;
      }
      sendError(res, 'Invalid authorization token', 401, 'AUTH_INVALID_TOKEN');
    }
  }

  /**
   * POST /api/v1/auth/sync-profile
   * Synchronizes or initializes user profile after Firebase sign-in/registration
   */
  async syncProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError(res, 'Authentication required to sync profile', 401, 'AUTH_REQUIRED');
      return;
    }

    const parsed = syncProfileSchema.safeParse(req.body);
    const updates: Record<string, unknown> = {};

    if (parsed.success) {
      if (parsed.data.displayName) updates.displayName = parsed.data.displayName;
      if (parsed.data.phoneNumber) updates.phoneNumber = parsed.data.phoneNumber;
    }

    const updatedProfile = await userRepository.update(req.user.uid, updates);

    sendSuccess(res, updatedProfile, 200);
  }

  /**
   * POST /api/v1/auth/logout
   * Invalidates active sessions and revokes refresh tokens on Firebase Auth
   */
  async logout(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      return;
    }

    await authService.revokeSessions(req.user.uid);

    sendSuccess(res, {
      message: 'Successfully logged out and revoked active sessions.',
      uid: req.user.uid,
    });
  }

  /**
   * GET /api/v1/auth/admin-check
   * Verifies that the user possesses server-validated ADMIN role
   */
  async adminCheck(req: Request, res: Response): Promise<void> {
    sendSuccess(res, {
      authorized: true,
      role: req.user!.role,
      message: 'Admin authorization confirmed server-side.',
    });
  }

  /**
   * GET /api/v1/auth/seller-check
   * Verifies that the user possesses server-validated SELLER or ADMIN role
   */
  async sellerCheck(req: Request, res: Response): Promise<void> {
    sendSuccess(res, {
      authorized: true,
      role: req.user!.role,
      message: 'Seller authorization confirmed server-side.',
    });
  }
}

export const authController = new AuthController();

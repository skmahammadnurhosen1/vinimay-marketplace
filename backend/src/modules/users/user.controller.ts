import { Request, Response } from 'express';
import { z } from 'zod';
import { userRepository } from './user.repository.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().min(7).max(15).optional(),
  photoUrl: z.string().url().optional().nullable(),
});

export class UserController {
  /**
   * GET /api/v1/users/me
   * Fetches profile of the currently authenticated user
   */
  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      return;
    }

    const profile = await userRepository.findById(req.user.uid);
    if (!profile) {
      sendError(res, 'User profile not found in database', 404, 'USER_NOT_FOUND');
      return;
    }

    sendSuccess(res, profile);
  }

  /**
   * PATCH /api/v1/users/me
   * Updates display name, phone number, or avatar photo
   */
  async updateMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      return;
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 'Invalid profile update payload', 400, 'VALIDATION_ERROR');
      return;
    }

    const updated = await userRepository.update(req.user.uid, parsed.data);
    sendSuccess(res, updated);
  }
}

export const userController = new UserController();

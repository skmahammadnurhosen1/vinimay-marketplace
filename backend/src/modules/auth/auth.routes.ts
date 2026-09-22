import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuthentication, requireRole } from '../../middlewares/auth.js';

export const authRouter = Router();

// Public Token Verification
authRouter.post('/verify-token', (req, res) => authController.verifyToken(req, res));

// Authenticated Session Endpoints
authRouter.get('/me', requireAuthentication, (req, res) => authController.getMe(req, res));
authRouter.post('/sync-profile', requireAuthentication, (req, res) => authController.syncProfile(req, res));
authRouter.post('/sync', requireAuthentication, (req, res) => authController.syncProfile(req, res));
authRouter.post('/logout', requireAuthentication, (req, res) => authController.logout(req, res));

// Server-Enforced RBAC Checks
authRouter.get('/admin-check', requireAuthentication, requireRole('ADMIN'), (req, res) =>
  authController.adminCheck(req, res)
);
authRouter.get('/seller-check', requireAuthentication, requireRole('SELLER', 'ADMIN'), (req, res) =>
  authController.sellerCheck(req, res)
);

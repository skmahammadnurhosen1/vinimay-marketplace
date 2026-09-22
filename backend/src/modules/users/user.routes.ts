import { Router } from 'express';
import { userController } from './user.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const userRouter = Router();

userRouter.get('/me', requireAuthentication, (req, res) => userController.getMe(req, res));
userRouter.patch('/me', requireAuthentication, (req, res) => userController.updateMe(req, res));

import { Router } from 'express';
import {
  getCustomerCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCustomerCart,
} from './cart.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const cartRouter = Router();

cartRouter.use(requireAuthentication);
cartRouter.get('/', getCustomerCart);
cartRouter.post('/items', addCartItem);
cartRouter.patch('/items/:productId', updateCartItem);
cartRouter.delete('/items/:productId', removeCartItem);
cartRouter.delete('/', clearCustomerCart);

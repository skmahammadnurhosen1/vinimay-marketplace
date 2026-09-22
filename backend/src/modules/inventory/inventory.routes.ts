import { Router } from 'express';
import {
  getSellerInventory,
  getProductInventory,
  adjustProductStock,
} from './inventory.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

export const sellerInventoryRouter = Router();

sellerInventoryRouter.use(requireAuthentication);
sellerInventoryRouter.get('/', getSellerInventory);
sellerInventoryRouter.get('/:productId', getProductInventory);
sellerInventoryRouter.post('/:productId/adjust', adjustProductStock);

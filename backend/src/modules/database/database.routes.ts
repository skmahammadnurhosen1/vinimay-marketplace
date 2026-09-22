import { Router } from 'express';
import { getAllCategories, getCategoryBySlug } from './categories.controller.js';
import { getAllBrands, getBrandById } from './brands.controller.js';
import {
  getManufacturers,
  getModels,
  getModelVariants,
  validateFitment,
} from './vehicles.controller.js';
import { getAddresses, createAddress, deleteAddress } from './addresses.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

// 1. Categories Router
export const categoriesRouter = Router();
categoriesRouter.get('/', getAllCategories);
categoriesRouter.get('/:slug', getCategoryBySlug);

// 2. Brands Router
export const brandsRouter = Router();
brandsRouter.get('/', getAllBrands);
brandsRouter.get('/:id', getBrandById);

// 3. Vehicles Router
export const vehiclesRouter = Router();
vehiclesRouter.get('/manufacturers', getManufacturers);
vehiclesRouter.get('/models', getModels);
vehiclesRouter.get('/variants', getModelVariants);
vehiclesRouter.post('/validate-fitment', validateFitment);

// 4. Addresses Router (Protected)
export const addressesRouter = Router();
addressesRouter.get('/', requireAuthentication, getAddresses);
addressesRouter.post('/', requireAuthentication, createAddress);
addressesRouter.delete('/:id', requireAuthentication, deleteAddress);

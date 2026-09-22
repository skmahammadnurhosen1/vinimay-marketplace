import { Request, Response } from 'express';
import { databaseRepository } from './database.repository.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getAllCategories(_req: Request, res: Response): Promise<void> {
  const categories = await databaseRepository.getCategories();
  sendSuccess(res, categories);
}

export async function getCategoryBySlug(req: Request, res: Response): Promise<void> {
  const rawSlug = req.params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  if (!slug) {
    sendError(res, 'Category slug parameter required', 400, 'BAD_REQUEST');
    return;
  }

  const category = await databaseRepository.getCategoryBySlug(slug);
  if (!category) {
    sendError(res, `Category "${slug}" not found`, 404, 'CATEGORY_NOT_FOUND');
    return;
  }

  sendSuccess(res, category);
}

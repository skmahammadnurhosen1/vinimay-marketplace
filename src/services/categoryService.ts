import { MARKETPLACE_CATEGORIES } from '../data/categories';
import { Category } from '../types';

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
}

class MockCategoryService implements ICategoryService {
  async getCategories(): Promise<Category[]> {
    return MARKETPLACE_CATEGORIES;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return MARKETPLACE_CATEGORIES.find(c => c.slug === slug || c.id === slug);
  }
}

export const categoryService = new MockCategoryService();

import { createClient } from './supabase-server';
import { Category } from '@/types/category';
import { DatabaseError } from './errors';
import { PRODUCTS_TABLE } from './constants';

const CATEGORIES_TABLE = 'categories';

/**
 * Fetch all categories from Supabase (server-side)
 */
export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new DatabaseError(`Failed to fetch categories: ${error.message}`, error.code);
  }

  return data ?? [];
}

/**
 * Fetch a single category by ID (server-side)
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new DatabaseError(`Failed to fetch category: ${error.message}`, error.code);
  }

  return data;
}

/**
 * Fetch a single category by slug (server-side)
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new DatabaseError(`Failed to fetch category: ${error.message}`, error.code);
  }

  return data;
}

/**
 * Get product count for a category
 */
export async function getCategoryProductCount(categoryId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  if (error) {
    throw new DatabaseError(`Failed to count products: ${error.message}`, error.code);
  }

  return count ?? 0;
}


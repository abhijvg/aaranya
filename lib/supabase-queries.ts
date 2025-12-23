import { createClient } from './supabase-server';
import { Product } from '@/types/product';
import { DatabaseError } from './errors';
import { PRODUCTS_TABLE } from './constants';

const NO_ROWS_ERROR_CODE = 'PGRST116';

/**
 * Fetch all products from Supabase (server-side)
 * @param categoryId - Optional category ID to filter products
 */
export async function getAllProducts(categoryId?: string): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from(PRODUCTS_TABLE)
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new DatabaseError(`Failed to fetch products: ${error.message}`, error.code);
  }

  return data ?? [];
}

/**
 * Fetch a single product by slug (server-side)
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === NO_ROWS_ERROR_CODE) {
      return null;
    }
    throw new DatabaseError(`Failed to fetch product: ${error.message}`, error.code);
  }

  return data;
}

/**
 * Fetch a single product by ID (server-side)
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === NO_ROWS_ERROR_CODE) {
      return null;
    }
    throw new DatabaseError(`Failed to fetch product: ${error.message}`, error.code);
  }

  return data;
}





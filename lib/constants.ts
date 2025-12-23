/**
 * Application constants
 */

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  PRODUCT_VIDEOS: 'product-videos',
} as const;

export const PRODUCT_CONSTRAINTS = {
  MAX_IMAGES: 5,
  MIN_PRICE: 0.01,
  DESCRIPTION_MAX_LENGTH: 5000,
  NAME_MAX_LENGTH: 200,
} as const;

export const ROUTES = {
  HOME: '/',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
} as const;

export const PRODUCTS_TABLE = 'products';


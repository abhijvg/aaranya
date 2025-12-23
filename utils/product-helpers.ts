import { Product } from '@/types/product';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x800?text=No+Image';

/**
 * Get the primary image URL from a product
 */
export function getProductImage(product: Product): string {
  if (product.images?.length > 0) {
    return product.images[0];
  }
  return PLACEHOLDER_IMAGE;
}

/**
 * Get all images from a product
 */
export function getProductImages(product: Product): string[] {
  return product.images?.length > 0 ? product.images : [];
}

/**
 * Check if product is in stock
 * Currently assumes all products are in stock
 * Can be extended with inventory management logic
 */
export function isProductInStock(_product: Product): boolean {
  return true;
}

/**
 * Get display price (offer_price if available, otherwise price)
 */
export function getDisplayPrice(product: Product): number {
  return product.offer_price ?? product.price;
}




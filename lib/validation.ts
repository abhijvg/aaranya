import { ValidationError } from './errors';
import { PRODUCT_CONSTRAINTS } from './constants';

const { MAX_IMAGES, MIN_PRICE, NAME_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } = PRODUCT_CONSTRAINTS;

export interface ProductInput {
  name: string;
  price: number;
  offer_price?: number | null;
  description: string;
  images: string[];
  video_url?: string | null;
  slug?: string;
  category_id?: string | null;
}

/**
 * Validate product input data
 */
export function validateProductInput(input: Partial<ProductInput>): void {
  const name = input.name?.trim();
  const description = input.description?.trim();

  if (!name) {
    throw new ValidationError('Product name is required');
  }

  if (name.length > NAME_MAX_LENGTH) {
    throw new ValidationError(`Product name must be less than ${NAME_MAX_LENGTH} characters`);
  }

  if (!description) {
    throw new ValidationError('Product description is required');
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    throw new ValidationError(`Product description must be less than ${DESCRIPTION_MAX_LENGTH} characters`);
  }

  if (input.price === undefined || input.price === null) {
    throw new ValidationError('Product price is required');
  }

  if (typeof input.price !== 'number' || input.price < MIN_PRICE) {
    throw new ValidationError(`Price must be at least ${MIN_PRICE}`);
  }

  if (input.offer_price !== null && input.offer_price !== undefined) {
    if (typeof input.offer_price !== 'number' || input.offer_price < MIN_PRICE) {
      throw new ValidationError(`Offer price must be at least ${MIN_PRICE}`);
    }

    if (input.offer_price >= input.price) {
      throw new ValidationError('Offer price must be less than regular price');
    }
  }

  if (!input.images || !Array.isArray(input.images) || input.images.length === 0) {
    throw new ValidationError('At least one image is required');
  }

  if (input.images.length > MAX_IMAGES) {
    throw new ValidationError(`Maximum ${MAX_IMAGES} images allowed`);
  }

  // Validate image URLs
  for (const image of input.images) {
    if (typeof image !== 'string' || !image.trim()) {
      throw new ValidationError('All images must be valid URLs');
    }
  }
}


import { Product } from '@/types/product';
import { getDisplayPrice } from './product-helpers';

const DEFAULT_PHONE_NUMBER = '7418769579';
const DESCRIPTION_PREVIEW_LENGTH = 100;
const WHATSAPP_BASE_URL = 'https://wa.me';

/**
 * Generates a WhatsApp message URL for sharing product information
 * @param product - The product to share
 * @param phoneNumber - The WhatsApp phone number (with country code, no + sign)
 * @returns WhatsApp URL string
 */
export function generateWhatsAppUrl(product: Product, phoneNumber: string = DEFAULT_PHONE_NUMBER): string {
  const price = getDisplayPrice(product);
  const descriptionPreview = product.description.substring(0, DESCRIPTION_PREVIEW_LENGTH);
  const message = `Hi! I'm interested in ${product.name} - ${descriptionPreview}... Price: ₹${price.toFixed(2)}`;
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp chat in a new window/tab
 * @param product - The product to share
 * @param phoneNumber - The WhatsApp phone number (with country code, no + sign)
 */
export function openWhatsApp(product: Product, phoneNumber: string = DEFAULT_PHONE_NUMBER): void {
  const url = generateWhatsAppUrl(product, phoneNumber);
  window.open(url, '_blank', 'noopener,noreferrer');
}





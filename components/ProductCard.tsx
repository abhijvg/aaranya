import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { getProductImage, isProductInStock, getDisplayPrice } from '@/utils/product-helpers';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImage(product);
  const inStock = isProductInStock(product);
  const displayPrice = getDisplayPrice(product);
  const hasOffer = product.offer_price !== null && product.offer_price < product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-semibold text-sm px-4 py-2 bg-black bg-opacity-50 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
        {hasOffer && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {Math.round(((product.price - product.offer_price) / product.price) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 truncate-lines-2 flex-grow">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{displayPrice.toFixed(2)}
          </span>
          {hasOffer && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

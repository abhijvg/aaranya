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
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative w-full h-64 bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {hasOffer ? (
              <>
                <span className="text-xl font-bold text-gray-900">₹{displayPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">₹{displayPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}



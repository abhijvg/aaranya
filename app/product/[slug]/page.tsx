import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/supabase-queries';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import { isProductInStock, getDisplayPrice, getProductImages } from '@/utils/product-helpers';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Note: generateStaticParams runs at build time, so we use the regular client
// For runtime, the page uses the server client via getAllProducts()
export async function generateStaticParams() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .order('created_at', { ascending: false });

    if (error || !products) {
      // Return empty array to allow dynamic rendering
      return [];
    }

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch {
    // Return empty array to allow dynamic rendering
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const inStock = isProductInStock(product);
  const displayPrice = getDisplayPrice(product);
  const hasOffer = product.offer_price !== null && product.offer_price < product.price;
  const allImages = getProductImages(product);

  return (
    <div className="container-tight py-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-12 transition-colors group"
      >
        <svg
          className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <ProductImageCarousel
          images={allImages}
          productName={product.name}
          videoUrl={product.video_url}
        />

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>

            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-bold text-gray-900">
                  ₹{displayPrice.toFixed(2)}
                </span>
                {hasOffer && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="inline-block px-4 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                      {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {inStock ? (
                <div className="inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-800 bg-primary-100 rounded-full border border-primary-200">
                  <span className="w-2.5 h-2.5 bg-primary-600 rounded-full mr-2.5"></span>
                  In Stock
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-800 bg-red-100 rounded-full border border-red-200">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full mr-2.5"></span>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-auto space-y-4 pt-8">
            {inStock ? (
              <WhatsAppButton product={product} />
            ) : (
              <div className="w-full py-4 px-6 bg-gray-100 text-gray-600 font-semibold rounded-xl text-center">
                Currently Out of Stock
              </div>
            )}
            <Link
              href="/"
              className="block w-full btn-secondary text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

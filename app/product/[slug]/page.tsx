import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/supabase-queries';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProductImage, isProductInStock, getDisplayPrice, getProductImages } from '@/utils/product-helpers';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative w-full h-96 lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={getProductImage(product)}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {getProductImages(product).length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {getProductImages(product).slice(1, 5).map((image, index) => (
                <div key={index} className="relative w-full h-20 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 20vw"
                  />
                </div>
              ))}
            </div>
          )}
          {product.video_url && (
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                src={product.video_url}
                controls
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              {product.offer_price && product.offer_price < product.price ? (
                <>
                  <p className="text-3xl font-bold text-gray-900">₹{getDisplayPrice(product).toFixed(2)}</p>
                  <p className="text-xl text-gray-500 line-through">₹{product.price.toFixed(2)}</p>
                  <span className="px-2 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded">
                    {Math.round(((product.price - product.offer_price) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <p className="text-3xl font-bold text-gray-900">₹{getDisplayPrice(product).toFixed(2)}</p>
              )}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{product.description}</p>
            <div className="flex items-center mb-6">
              {isProductInStock(product) ? (
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {isProductInStock(product) && <WhatsAppButton product={product} />}
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


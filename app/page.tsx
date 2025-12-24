import { getAllProducts } from '@/lib/supabase-queries';
import { getAllCategories } from '@/lib/category-queries';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(category || undefined),
    getAllCategories(),
  ]);

  return (
    <div className="container-tight py-16 sm:py-24">
      {/* Hero Section */}
      <section className="mb-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to Aaranya by Abhi
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Discover beautifully handcrafted products made by skilled artisans. Each piece tells a story of tradition, craftsmanship, and sustainability.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="mb-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Collection</h2>
          <CategoryFilter categories={categories} />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">No products found in this category.</p>
            <p className="text-sm mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}

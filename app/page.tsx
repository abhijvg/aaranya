import { Suspense } from 'react';
import { getAllProducts } from '@/lib/supabase-queries';
import { getAllCategories } from '@/lib/category-queries';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

function CategoryFilterSuspense({ categories }: { categories: Awaited<ReturnType<typeof getAllCategories>> }) {
  return (
    <Suspense fallback={<div className="mb-8">Loading filters...</div>}>
      <CategoryFilter categories={categories} />
    </Suspense>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(category || undefined),
    getAllCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Welcome to Aaranya by Abhi - Handcrafted with Heart
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
          Discover beautifully handcrafted products made by skilled artisans. 
          Each piece tells a story of tradition, craftsmanship, and sustainability.
        </p>
      </section>

      <section id="products" className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Our Products</h2>
        <CategoryFilterSuspense categories={categories} />
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}





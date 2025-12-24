'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Category } from '@/types/category';

interface CategoryFilterProps {
  categories: Category[];
}

function CategoryFilterContent({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const handleCategoryChange = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Filter by Category</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
            !selectedCategory
              ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  return (
    <Suspense fallback={<div className="mb-10 text-gray-500">Loading filters...</div>}>
      <CategoryFilterContent categories={categories} />
    </Suspense>
  );
}

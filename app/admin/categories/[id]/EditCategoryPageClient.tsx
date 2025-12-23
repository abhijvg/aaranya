'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category';
import CategoryForm from '@/components/admin/CategoryForm';

interface EditCategoryPageClientProps {
  category: Category;
}

export default function EditCategoryPageClient({ category }: EditCategoryPageClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { name: string; description?: string; slug?: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      router.push('/admin/categories');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Category</h1>
      <CategoryForm
        onSubmit={handleSubmit}
        loading={loading}
        initialData={{
          name: category.name,
          description: category.description || '',
          slug: category.slug,
        }}
      />
    </div>
  );
}


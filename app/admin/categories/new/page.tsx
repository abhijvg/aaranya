'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { name: string; description?: string; slug?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      router.push('/admin/categories');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Category</h1>
      <CategoryForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}


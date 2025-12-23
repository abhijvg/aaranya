'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from './ProductForm';
import { Product } from '@/types/product';
import { generateSlug } from '@/utils/slug';

interface FormData {
  name: string;
  price: string;
  offer_price: string;
  description: string;
  images: string[];
  video_url: string;
  slug: string;
  category_id: string;
}

export default function EditProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Generate slug from name if not provided
      const slug = formData.slug || generateSlug(formData.name);

      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
          description: formData.description,
          images: formData.images,
          video_url: formData.video_url || null,
          slug,
          category_id: formData.category_id || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm product={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}


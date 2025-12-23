'use client';

import { useState, useEffect } from 'react';
import { generateSlug } from '@/utils/slug';

interface CategoryFormProps {
  onSubmit: (data: { name: string; description?: string; slug?: string }) => void;
  loading?: boolean;
  initialData?: {
    name: string;
    description?: string;
    slug?: string;
  };
}

export default function CategoryForm({ onSubmit, loading = false, initialData }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!initialData?.slug);

  useEffect(() => {
    if (autoGenerateSlug && name) {
      setSlug(generateSlug(name));
    }
  }, [name, autoGenerateSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Category name is required');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      slug: slug.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Handmade Jewelry"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of this category..."
        />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="autoSlug"
            checked={autoGenerateSlug}
            onChange={(e) => {
              setAutoGenerateSlug(e.target.checked);
              if (e.target.checked && name) {
                setSlug(generateSlug(name));
              }
            }}
            className="mr-2"
          />
          <label htmlFor="autoSlug" className="text-sm font-medium text-gray-700">
            Auto-generate slug from name
          </label>
        </div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setAutoGenerateSlug(false);
          }}
          disabled={autoGenerateSlug}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="category-slug"
        />
        <p className="mt-1 text-sm text-gray-500">
          URL-friendly identifier (auto-generated if checkbox is checked)
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}


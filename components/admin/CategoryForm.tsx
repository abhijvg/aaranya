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
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-base"
          placeholder="e.g., Handmade Jewelry"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="input-base"
          placeholder="Brief description of this category..."
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
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
            className="w-5 h-5 mt-0.5 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
          />
          <label htmlFor="autoSlug" className="text-sm font-medium text-gray-900 cursor-pointer">
            Auto-generate slug from category name
          </label>
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-gray-900 mb-2">
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
            className="input-base disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="category-slug"
          />
          <p className="mt-2 text-xs text-gray-600">
            URL-friendly identifier (auto-generated if checkbox is checked)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}

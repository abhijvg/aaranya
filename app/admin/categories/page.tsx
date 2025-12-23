'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Category } from '@/types/category';
import { handleError } from '@/lib/errors';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Products in this category will have their category removed.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      // Refresh categories list
      fetchCategories();
    } catch (err) {
      const errorMessage = handleError(err);
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="btn-sm-primary self-start"
        >
          + Create Category
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
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
              d="M7 21H3a1 1 0 01-1-1V5a1 1 0 011-1h4m6 0h4a1 1 0 011 1v11a1 1 0 01-1 1m-6 0h6a1 1 0 001-1v-7a1 1 0 00-1-1m0 0V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m15 1a1 1 0 001-1v-1a1 1 0 00-1-1h-4a1 1 0 00-1 1v1a1 1 0 001 1h4z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">No categories yet</p>
          <p className="text-gray-600 mb-6">Create your first category to organize products</p>
          <Link href="/admin/categories/new" className="btn-primary">
            Create First Category
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Slug</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs font-mono">{category.slug}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {category.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {format(new Date(category.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="text-primary-600 hover:text-primary-900 font-medium text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

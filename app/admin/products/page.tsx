import Link from 'next/link';
import { getAllProducts } from '@/lib/supabase-queries';
import { format } from 'date-fns';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import { ROUTES } from '@/lib/constants';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="btn-sm-primary self-start"
        >
          + Create Product
        </Link>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">No products yet</p>
          <p className="text-gray-600 mb-6">Create your first product to get started</p>
          <Link href={ROUTES.ADMIN_PRODUCT_NEW} className="btn-primary">
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Offer</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {product.offer_price ? (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold text-primary-800 bg-primary-100 rounded-full">
                          ₹{product.offer_price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.category ? (
                        <span className="text-gray-700">{product.category.name}</span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {format(new Date(product.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-900 font-medium text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
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

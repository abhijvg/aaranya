import Link from 'next/link';
import { getAllProducts } from '@/lib/supabase-queries';
import { format } from 'date-fns';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import { ROUTES } from '@/lib/constants';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href={ROUTES.ADMIN_PRODUCT_NEW}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create New Product
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No products found. Create your first product!
            </li>
          ) : (
            products.map((product) => (
              <li key={product.id}>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <span className="ml-2 text-sm text-gray-500">({product.slug})</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Price: <span className="font-medium text-gray-900">₹{product.price}</span>
                      </span>
                      {product.offer_price && (
                        <span>
                          Offer: <span className="font-medium text-green-600">₹{product.offer_price}</span>
                        </span>
                      )}
                      {product.category && (
                        <span>
                          Category: <span className="font-medium text-gray-900">{product.category.name}</span>
                        </span>
                      )}
                      <span>
                        Created: {format(new Date(product.created_at), 'MMM d, yyyy')}
                      </span>
                      <span>
                        Images: {product.images?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-300">|</span>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}


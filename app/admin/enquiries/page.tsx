import { Suspense } from 'react';
import { getAllProducts } from '@/lib/supabase-queries';
import EnquiriesList from '@/components/admin/EnquiriesList';

export default async function AdminEnquiriesPage() {
  const products = await getAllProducts();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-600 mt-2">Track and manage customer enquiries</p>
      </div>

      {/* Enquiries List with Filtering */}
      <Suspense fallback={<div className="text-gray-600">Loading enquiries...</div>}>
        <EnquiriesList products={products} />
      </Suspense>
    </div>
  );
}


import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
      <p className="text-gray-600 mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/admin/categories"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Categories
      </Link>
    </div>
  );
}


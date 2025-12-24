'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useState } from 'react';

export default function AdminNav() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container-tight">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Branding */}
          <Link href="/admin/products" className="flex items-center hover:opacity-75 transition-opacity gap-3">
            <Image
              src="/images/logo.png"
              alt="Aaranya Admin"
              width={160}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
            <span className="hidden sm:inline text-sm text-gray-500 font-medium border-l border-gray-300 pl-3">
              Admin
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/admin/products"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm rounded-lg transition-colors"
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm rounded-lg transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/admin/enquiries"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm rounded-lg transition-colors"
            >
              Enquiries
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm rounded-lg transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

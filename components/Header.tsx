'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAdmin(!!user);
    };

    checkAdmin();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-tight">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-75 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Aaranya by Abhi"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Products
            </Link>
            {isAdmin ? (
              <Link
                href="/admin/products"
                className="px-4 py-2 text-primary-700 font-semibold bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                Admin
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Admin Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

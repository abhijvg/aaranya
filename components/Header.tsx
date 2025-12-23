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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Aaranya by Abhi"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/#products" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Products
            </Link>
            {isAdmin ? (
              <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors">
                Admin
              </Link>
            ) : (
              <Link href="/admin/login" className="text-gray-500 hover:text-gray-700 font-medium transition-colors">
                Admin Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}





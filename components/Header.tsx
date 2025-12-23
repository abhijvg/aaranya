'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const supabaseRef = useRef(createClient());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const supabase = supabaseRef.current;

    const checkAdmin = async () => {
      if (!isMountedRef.current) return;
      
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        if (isMountedRef.current) {
          setIsAdmin((prev) => {
            const newValue = !!user;
            // Only update if value actually changed to prevent unnecessary re-renders
            return prev !== newValue ? newValue : prev;
          });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (isMountedRef.current) {
          setIsAdmin(false);
        }
      }
    };

    // Initial check
    checkAdmin();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      if (isMountedRef.current) {
        checkAdmin();
      }
    });

    return () => {
      isMountedRef.current = false;
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

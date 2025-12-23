import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aranya - Handcrafted Artisan Products',
  description: 'Discover beautiful handcrafted products made by skilled artisans',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-white">{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 mt-24">
          <div className="container-tight py-12">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                © {new Date().getFullYear()} Aaranya by Abhi. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Handcrafted with ❤️ by skilled artisans
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

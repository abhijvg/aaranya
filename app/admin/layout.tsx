import { headers } from 'next/headers';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we're on the login page using the header set by middleware
  const headersList = await headers();
  const isLoginPage = headersList.get('x-is-login-page') === 'true';

  // Middleware handles authentication and redirects
  // The login page has its own layout, but this parent layout still wraps it
  // So we conditionally render AdminNav

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && <AdminNav />}
      <main className={isLoginPage ? '' : 'container-tight py-12'}>
        {children}
      </main>
    </div>
  );
}

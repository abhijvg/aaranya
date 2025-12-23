import { requireAuthWithRedirect } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles authentication, but this is a fallback check
  await requireAuthWithRedirect();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="container-tight py-12">
        {children}
      </main>
    </div>
  );
}

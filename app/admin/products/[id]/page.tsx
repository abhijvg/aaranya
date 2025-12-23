import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import EditProductClient from '@/components/admin/EditProductClient';

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <EditProductClient product={product} />;
}


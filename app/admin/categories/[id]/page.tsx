import { notFound } from 'next/navigation';
import EditCategoryPageClient from './EditCategoryPageClient';
import { getCategoryById } from '@/lib/category-queries';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return <EditCategoryPageClient category={category} />;
}


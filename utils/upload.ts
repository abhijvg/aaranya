import { createClient } from '@/lib/supabase-client';
import { STORAGE_BUCKETS } from '@/lib/constants';

type StorageBucket = typeof STORAGE_BUCKETS.PRODUCT_IMAGES | typeof STORAGE_BUCKETS.PRODUCT_VIDEOS;

const CACHE_CONTROL = '3600';

/**
 * Generate unique filename
 */
function generateFileName(originalName: string): string {
  const fileExt = originalName.split('.').pop() || 'file';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}-${random}.${fileExt}`;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  const fileName = generateFileName(file.name);
  const filePath = `images/${fileName}`;

  const { error, data } = await supabase.storage
    .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
    .upload(filePath, file, {
      cacheControl: CACHE_CONTROL,
      upsert: false,
    });

  if (error || !data) {
    throw new Error(`Failed to upload image: ${error?.message || 'Unknown error'}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload video to Supabase Storage
 */
export async function uploadVideo(file: File): Promise<string> {
  const supabase = createClient();
  const fileName = generateFileName(file.name);
  const filePath = `videos/${fileName}`;

  const { error, data } = await supabase.storage
    .from(STORAGE_BUCKETS.PRODUCT_VIDEOS)
    .upload(filePath, file, {
      cacheControl: CACHE_CONTROL,
      upsert: false,
    });

  if (error || !data) {
    throw new Error(`Failed to upload video: ${error?.message || 'Unknown error'}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKETS.PRODUCT_VIDEOS)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Extract file path from Supabase storage URL
 */
function extractFilePath(url: string): string {
  const storagePattern = '/storage/v1/object/public/';
  if (url.includes(storagePattern)) {
    const parts = url.split(storagePattern)[1]?.split('/');
    if (parts && parts.length > 1) {
      return parts.slice(1).join('/');
    }
  }
  return url;
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = createClient();
  const filePath = extractFilePath(path);

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}


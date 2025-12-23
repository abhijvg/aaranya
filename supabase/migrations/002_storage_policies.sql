-- Storage bucket policies for product-images
-- Note: Create the buckets first in Supabase Dashboard: Storage > New Bucket

-- Policy: Allow public read access to product-images
DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
CREATE POLICY "Public read access for product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to upload to product-images
DROP POLICY IF EXISTS "Authenticated upload to product-images" ON storage.objects;
CREATE POLICY "Authenticated upload to product-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update product-images
DROP POLICY IF EXISTS "Authenticated update product-images" ON storage.objects;
CREATE POLICY "Authenticated update product-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete product-images
DROP POLICY IF EXISTS "Authenticated delete product-images" ON storage.objects;
CREATE POLICY "Authenticated delete product-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow public read access to product-videos
DROP POLICY IF EXISTS "Public read access for product-videos" ON storage.objects;
CREATE POLICY "Public read access for product-videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-videos');

-- Policy: Allow authenticated users to upload to product-videos
DROP POLICY IF EXISTS "Authenticated upload to product-videos" ON storage.objects;
CREATE POLICY "Authenticated upload to product-videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-videos' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update product-videos
DROP POLICY IF EXISTS "Authenticated update product-videos" ON storage.objects;
CREATE POLICY "Authenticated update product-videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-videos' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete product-videos
DROP POLICY IF EXISTS "Authenticated delete product-videos" ON storage.objects;
CREATE POLICY "Authenticated delete product-videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-videos' 
  AND auth.role() = 'authenticated'
);


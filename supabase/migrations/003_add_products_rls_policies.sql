-- Add RLS policies for authenticated users to manage products
-- This allows authenticated admins to insert, update, and delete products

-- Policy: Allow authenticated users to insert products
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
CREATE POLICY "Allow authenticated users to insert products"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update products
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete products
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;
CREATE POLICY "Allow authenticated users to delete products"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');


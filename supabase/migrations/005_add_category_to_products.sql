-- Add category_id column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create index on category_id for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Add comment to column
COMMENT ON COLUMN products.category_id IS 'Foreign key reference to categories table';


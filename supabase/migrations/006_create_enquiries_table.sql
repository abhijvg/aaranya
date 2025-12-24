-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'sale_done', 'sale_failed', 'cancelled')),
  description TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on product_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_enquiries_product_id ON enquiries(product_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- Create function to update updated_at timestamp (if it doesn't exist)
-- This function is shared across tables, so we use CREATE OR REPLACE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for tracking enquiries)
CREATE POLICY "Allow public to create enquiries"
  ON enquiries
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all enquiries
CREATE POLICY "Allow authenticated users to read enquiries"
  ON enquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update enquiries
CREATE POLICY "Allow authenticated users to update enquiries"
  ON enquiries
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete enquiries
CREATE POLICY "Allow authenticated users to delete enquiries"
  ON enquiries
  FOR DELETE
  USING (auth.role() = 'authenticated');


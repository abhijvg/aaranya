# Supabase Setup Guide

This guide will help you set up Supabase for the Aranya project.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be fully provisioned

## 2. Get Your API Keys

1. Go to your project settings: **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## 4. Create the Products Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migrations in order:
   - Copy and paste the contents of `supabase/migrations/001_create_products_table.sql`
   - Click **Run** to execute
   - Copy and paste the contents of `supabase/migrations/003_add_products_rls_policies.sql`
   - Click **Run** to execute (this enables authenticated users to manage products)

Alternatively, you can use the Supabase CLI:

```bash
supabase db push
```

**Important**: Make sure to run migration `003_add_products_rls_policies.sql` after creating the table, otherwise authenticated users won't be able to create, update, or delete products.

## 5. Set Up Storage Buckets

### Create `product-images` Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `product-images`
4. Make it **Public** (so images can be accessed without authentication)
5. Click **Create bucket**

### Create `product-videos` Bucket

1. Click **New bucket** again
2. Name: `product-videos`
3. Make it **Public** (so videos can be accessed without authentication)
4. Click **Create bucket**

### Set Up Storage Policies

For each bucket, you'll need to set up policies:

1. Go to **Storage** → Select the bucket → **Policies**
2. Click **New Policy**
3. For public read access, create a policy:

**Policy Name**: `Allow public read access`
- **Allowed operation**: SELECT
- **Policy definition**: `true`

For authenticated uploads (if needed):

**Policy Name**: `Allow authenticated uploads`
- **Allowed operation**: INSERT
- **Policy definition**: `auth.role() = 'authenticated'`

## 6. Upload Files

You can upload files to storage buckets via:
- Supabase Dashboard (Storage → Select bucket → Upload)
- Supabase Client API (see `lib/supabase.ts`)

## 7. Verify Setup

After completing the above steps, you can verify your setup by:

1. Checking that the `products` table exists in **Table Editor**
2. Verifying storage buckets exist in **Storage**
3. Testing the connection in your Next.js app

## Using Supabase Client

The Supabase client is available in `lib/supabase.ts`. Import it in your components:

```typescript
import { supabase } from '@/lib/supabase';

// Example: Fetch products
const { data, error } = await supabase
  .from('products')
  .select('*');
```

## Storage URLs

When uploading files to Supabase Storage, you'll get URLs like:
- Images: `https://[project-ref].supabase.co/storage/v1/object/public/product-images/[filename]`
- Videos: `https://[project-ref].supabase.co/storage/v1/object/public/product-videos/[filename]`

Store these URLs in the `images` array or `video_url` field of your products table.




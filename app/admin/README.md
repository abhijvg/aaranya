# Admin Product Management Module

Complete admin interface for managing products in the Aranya e-commerce application.

## Features

- ✅ **Authentication**: Supabase Auth with email/password and OAuth (Google, GitHub, Discord, Facebook)
- ✅ **Protected Routes**: All admin routes require authentication
- ✅ **Product CRUD**: Create, Read, Update, Delete products
- ✅ **File Upload**: Upload images and videos to Supabase Storage
- ✅ **Form Validation**: Client and server-side validation
- ✅ **Responsive UI**: Clean, modern interface with Tailwind CSS

## Setup

### 1. Create Admin User

First, you need to create an admin user in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter email and password
5. Save the credentials

Alternatively, you can enable email signup in Authentication settings and register through the login page.

### 1.1. Enable OAuth Providers (Optional)

To enable OAuth sign-in (Google, GitHub, Discord, Facebook):

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable the providers you want to use:
   - **Google**: Enable and add Client ID and Client Secret from Google Cloud Console
   - **GitHub**: Enable and add Client ID and Client Secret from GitHub OAuth Apps
   - **Discord**: Enable and add Client ID and Client Secret from Discord Developer Portal
   - **Facebook**: Enable and add App ID and App Secret from Facebook Developers
3. For each provider, set the **Redirect URL** to:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   Or for local development:
   ```
   http://localhost:3000/auth/callback
   ```
4. Save the settings

**Note**: Make sure to add your site URL and redirect URLs in the Supabase project settings under **Authentication** → **URL Configuration**.

### 2. Run Database Migrations

Execute the SQL migrations in your Supabase SQL Editor (in order):

1. `supabase/migrations/001_create_products_table.sql` - Creates products table
2. `supabase/migrations/003_add_products_rls_policies.sql` - **IMPORTANT**: Enables authenticated users to manage products (INSERT, UPDATE, DELETE)
3. `supabase/migrations/002_storage_policies.sql` - Sets up storage policies

**Note**: Migration 003 is critical - without it, you'll get "row-level security policy" errors when trying to create or edit products.

### 3. Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create bucket: `product-images` (make it **Public**)
3. Create bucket: `product-videos` (make it **Public**)

The storage policies SQL will configure the access rules.

## Admin Routes

### `/admin/login`
- Login page for admin authentication
- Supports email/password and OAuth providers (Google, GitHub, Discord, Facebook)
- Redirects to `/admin/products` after successful login
- OAuth providers redirect through `/auth/callback` route

### `/admin/products`
- List all products
- Shows: name, price, offer price, created date, image count
- Actions: Edit, Delete
- Button to create new product

### `/admin/products/new`
- Create new product form
- Upload up to 5 images
- Upload 1 optional video
- Auto-generates slug from product name

### `/admin/products/[id]`
- Edit existing product
- Pre-filled form with existing data
- Can replace images/videos
- Updates product in database

## API Routes

All API routes require authentication and are protected by middleware.

### `GET /api/products`
- List all products
- Returns JSON array of products

### `POST /api/products`
- Create new product
- Body: `{ name, price, offer_price?, description, images, video_url?, slug? }`
- Returns created product

### `GET /api/products/[id]`
- Get single product by ID
- Returns product object

### `PUT /api/products/[id]`
- Update product
- Body: Same as POST
- Returns updated product

### `DELETE /api/products/[id]`
- Delete product
- Returns `{ success: true }`

## Security

- **Authentication**: All admin routes require Supabase Auth
- **Middleware**: Protects routes at the edge
- **Server-side Validation**: API routes validate all inputs
- **RLS Policies**: Database Row Level Security enabled
- **Storage Policies**: Only authenticated users can upload

## File Upload

### Images
- Maximum 5 images per product
- Supported formats: All image formats
- Stored in `product-images` bucket
- Public read access

### Videos
- Maximum 1 video per product (optional)
- Supported formats: All video formats
- Stored in `product-videos` bucket
- Public read access

## Product Form

The `ProductForm` component handles:
- Form validation (client-side)
- Image preview before upload
- Video preview
- File upload to Supabase Storage
- Error handling
- Loading states

## Components

### `AdminNav`
- Navigation bar for admin area
- Logout functionality
- Link to view public site

### `ProductForm`
- Reusable form for create/edit
- Handles file uploads
- Client-side validation
- Image/video preview

### `DeleteProductButton`
- Delete confirmation dialog
- API call to delete product
- Refresh after deletion

## Usage Example

1. **Login**: Navigate to `/admin/login` and sign in
2. **View Products**: Go to `/admin/products` to see all products
3. **Create Product**: Click "Create New Product"
   - Fill in form fields
   - Upload images (up to 5)
   - Optionally upload video
   - Click "Create Product"
4. **Edit Product**: Click "Edit" on any product
   - Modify fields
   - Add/remove images
   - Update product
5. **Delete Product**: Click "Delete" and confirm

## Troubleshooting

### "Unauthorized" errors
- Check that you're logged in
- Verify Supabase environment variables are set
- Check browser console for auth errors

### File upload fails
- Verify storage buckets exist
- Check bucket is set to Public
- Verify storage policies are applied
- Check file size limits

### Products not showing
- Check database connection
- Verify RLS policies allow SELECT
- Check API route responses in Network tab

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```


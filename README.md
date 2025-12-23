# Aranya - Next.js E-commerce Application

A modern e-commerce application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Optimized for free hosting on Vercel.

## Features

- **Next.js 14 App Router** - Modern React framework with server components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase Integration** - PostgreSQL database and file storage
- **Admin Dashboard** - Complete product management interface
- **Authentication** - Supabase Auth with protected admin routes
- **Product Listing Page (PLP)** - Browse all products
- **Product Detail Page (PDP)** - View individual product details
- **WhatsApp Integration** - Contact via WhatsApp for inquiries
- **Responsive Design** - Works on all devices
- **SEO Optimized** - Static generation for better performance

## Project Structure

```
aranya/
├── app/
│   ├── layout.tsx              # Root layout with Header and Footer
│   ├── page.tsx                 # Home page / Product Listing Page
│   ├── globals.css              # Global styles
│   ├── admin/                   # Admin dashboard
│   │   ├── login/              # Admin login page
│   │   └── products/           # Product management pages
│   ├── api/                    # API routes
│   │   └── products/           # Product CRUD API
│   └── product/
│       └── [slug]/
│           ├── page.tsx         # Product Detail Page
│           └── not-found.tsx    # 404 page for products
├── components/
│   ├── Header.tsx               # Site header/navigation
│   ├── ProductCard.tsx          # Product card component
│   ├── ProductGrid.tsx          # Grid layout for products
│   └── admin/                   # Admin components
│       ├── AdminNav.tsx        # Admin navigation
│       ├── ProductForm.tsx     # Product form (create/edit)
│       └── DeleteProductButton.tsx
├── lib/
│   ├── supabase-server.ts       # Server-side Supabase client
│   ├── supabase-client.ts       # Client-side Supabase client
│   ├── supabase-queries.ts      # Supabase query functions
│   ├── auth.ts                  # Authentication utilities
│   ├── errors.ts                 # Custom error classes
│   ├── validation.ts             # Input validation utilities
│   └── constants.ts              # Application constants
├── middleware.ts                # Next.js middleware for auth
├── supabase/
│   ├── migrations/              # Database migration files
│   └── README.md                # Supabase setup guide
├── types/
│   └── product.ts               # TypeScript product types
└── utils/
    ├── whatsapp.ts              # WhatsApp utility functions
    ├── slug.ts                  # Slug generation utilities
    └── upload.ts                 # File upload utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings → API
   - Create a `.env.local` file in the root directory:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Follow the detailed setup guide in `supabase/README.md` to:
     - Create the products table
     - Set up storage buckets (`product-images` and `product-videos`)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Vercel will automatically detect Next.js and configure the build settings
5. Deploy!

**Note**: Make sure your Supabase project is set up and the products table is created before deploying.

## Customization

### Adding Products

Products are now managed through the Supabase database. Use the admin dashboard at `/admin/products` to:
- Create new products
- Edit existing products
- Upload product images and videos
- Delete products

All product data is stored in Supabase and fetched dynamically. The static data file (`data/products.ts`) is deprecated and no longer used.

### WhatsApp Number

Update the default phone number in `utils/whatsapp.ts` or pass it as a parameter when calling the function.

### Styling

Modify `tailwind.config.ts` to customize the design system, or edit component files to change styles.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - PostgreSQL database and file storage
- **next/image** - Optimized images
- **next/link** - Client-side navigation

## Supabase Setup

For detailed Supabase setup instructions, see [supabase/README.md](./supabase/README.md).

The setup includes:
- Database table creation (`products`)
- Storage buckets configuration (`product-images`, `product-videos`)
- Row Level Security (RLS) policies
- Helper functions for querying and file uploads

## Admin Dashboard

The application includes a complete admin dashboard for managing products.

### Quick Start

1. **Create Admin User**: Go to Supabase Dashboard → Authentication → Users → Add User
2. **Login**: Navigate to `/admin/login` and sign in
3. **Manage Products**: Access `/admin/products` to view, create, edit, and delete products

### Features

- ✅ Secure authentication with Supabase Auth
- ✅ Protected admin routes (middleware + server-side validation)
- ✅ Product CRUD operations
- ✅ File upload (images & videos) to Supabase Storage
- ✅ Form validation (client & server-side)
- ✅ Responsive admin UI

For detailed admin documentation, see [app/admin/README.md](./app/admin/README.md).

## License

MIT



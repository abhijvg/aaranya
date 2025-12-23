import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { generateSlug, generateUniqueSlug } from '@/utils/slug';
import { validateProductInput, type ProductInput } from '@/lib/validation';
import { AuthenticationError, ValidationError, DatabaseError } from '@/lib/errors';
import { PRODUCTS_TABLE } from '@/lib/constants';

/**
 * GET /api/products - List all products (admin only)
 */
export async function GET() {
  try {
    await requireAuth();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch products: ${error.message}`, error.code);
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/products - Create new product
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, price, offer_price, description, images, video_url, slug, category_id } = body;

    const productInput: ProductInput = {
      name: name?.trim(),
      price: typeof price === 'string' ? parseFloat(price) : price,
      offer_price: offer_price ? (typeof offer_price === 'string' ? parseFloat(offer_price) : offer_price) : null,
      description: description?.trim(),
      images,
      video_url: video_url || null,
      slug: slug?.trim(),
      category_id: category_id || null,
    };

    validateProductInput(productInput);

    const supabase = await createClient();

    // Generate unique slug if not provided
    let finalSlug = productInput.slug || generateSlug(productInput.name);
    const { data: existingProducts } = await supabase
      .from(PRODUCTS_TABLE)
      .select('slug');

    if (existingProducts) {
      const existingSlugs = existingProducts.map((p) => p.slug);
      finalSlug = generateUniqueSlug(finalSlug, existingSlugs);
    }

    // Insert product
    const { data, error: insertError } = await supabase
      .from(PRODUCTS_TABLE)
      .insert({
        name: productInput.name,
        price: productInput.price,
        offer_price: productInput.offer_price,
        description: productInput.description,
        images: productInput.images,
        video_url: productInput.video_url,
        slug: finalSlug,
        category_id: productInput.category_id || null,
      })
      .select()
      .single();

    if (insertError) {
      throw new DatabaseError(`Failed to create product: ${insertError.message}`, insertError.code);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


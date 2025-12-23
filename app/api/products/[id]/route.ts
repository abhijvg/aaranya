import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { generateSlug, generateUniqueSlug } from '@/utils/slug';
import { validateProductInput, type ProductInput } from '@/lib/validation';
import { AuthenticationError, ValidationError, DatabaseError, NotFoundError } from '@/lib/errors';
import { PRODUCTS_TABLE } from '@/lib/constants';

const NO_ROWS_ERROR_CODE = 'PGRST116';

/**
 * GET /api/products/[id] - Get single product
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === NO_ROWS_ERROR_CODE) {
        throw new NotFoundError('Product not found');
      }
      throw new DatabaseError(`Failed to fetch product: ${error.message}`, error.code);
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/products/[id] - Update product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
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

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from(PRODUCTS_TABLE)
      .select('slug')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === NO_ROWS_ERROR_CODE) {
        throw new NotFoundError('Product not found');
      }
      throw new DatabaseError(`Failed to fetch product: ${fetchError.message}`, fetchError.code);
    }

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Generate unique slug if changed
    let finalSlug = productInput.slug || generateSlug(productInput.name);
    if (finalSlug !== existingProduct.slug) {
      const { data: allProducts } = await supabase
        .from(PRODUCTS_TABLE)
        .select('slug');

      if (allProducts) {
        const existingSlugs = allProducts
          .map((p) => p.slug)
          .filter((s) => s !== existingProduct.slug);
        finalSlug = generateUniqueSlug(finalSlug, existingSlugs);
      }
    }

    // Update product
    const { data, error: updateError } = await supabase
      .from(PRODUCTS_TABLE)
      .update({
        name: productInput.name,
        price: productInput.price,
        offer_price: productInput.offer_price,
        description: productInput.description,
        images: productInput.images,
        video_url: productInput.video_url,
        slug: finalSlug,
        category_id: productInput.category_id || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new DatabaseError(`Failed to update product: ${updateError.message}`, updateError.code);
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id] - Delete product
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const supabase = await createClient();

    // Check if product exists
    const { data: product, error: fetchError } = await supabase
      .from(PRODUCTS_TABLE)
      .select('images, video_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === NO_ROWS_ERROR_CODE) {
        throw new NotFoundError('Product not found');
      }
      throw new DatabaseError(`Failed to fetch product: ${fetchError.message}`, fetchError.code);
    }

    // Delete product
    const { error: deleteError } = await supabase
      .from(PRODUCTS_TABLE)
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new DatabaseError(`Failed to delete product: ${deleteError.message}`, deleteError.code);
    }

    // Note: Storage files are not automatically deleted
    // Consider implementing cleanup logic for associated files

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


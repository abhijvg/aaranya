import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { generateSlug, generateUniqueSlug } from '@/utils/slug';
import { AuthenticationError, ValidationError, DatabaseError, NotFoundError } from '@/lib/errors';

const CATEGORIES_TABLE = 'categories';
const NO_ROWS_ERROR_CODE = 'PGRST116';

/**
 * GET /api/categories/[id] - Get single category
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === NO_ROWS_ERROR_CODE) {
        throw new NotFoundError('Category not found');
      }
      throw new DatabaseError(`Failed to fetch category: ${error.message}`, error.code);
    }

    return NextResponse.json(data);
  } catch (error) {
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
 * PUT /api/categories/[id] - Update category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = await request.json();
    const { name, description, slug } = body;

    if (!name?.trim()) {
      throw new ValidationError('Category name is required');
    }

    const supabase = await createClient();

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from(CATEGORIES_TABLE)
      .select('slug, name')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === NO_ROWS_ERROR_CODE) {
        throw new NotFoundError('Category not found');
      }
      throw new DatabaseError(`Failed to fetch category: ${fetchError.message}`, fetchError.code);
    }

    // Check if name already exists (excluding current category)
    const { data: existingName } = await supabase
      .from(CATEGORIES_TABLE)
      .select('id')
      .eq('name', name.trim())
      .neq('id', id)
      .single();

    if (existingName) {
      throw new ValidationError('Category with this name already exists');
    }

    // Generate unique slug if changed
    let finalSlug = slug?.trim() || generateSlug(name);
    if (finalSlug !== existingCategory.slug) {
      const { data: allCategories } = await supabase
        .from(CATEGORIES_TABLE)
        .select('slug');

      if (allCategories) {
        const existingSlugs = allCategories
          .map((c) => c.slug)
          .filter((s) => s !== existingCategory.slug);
        finalSlug = generateUniqueSlug(finalSlug, existingSlugs);
      }
    }

    // Update category
    const { data, error: updateError } = await supabase
      .from(CATEGORIES_TABLE)
      .update({
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new DatabaseError(`Failed to update category: ${updateError.message}`, updateError.code);
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
 * DELETE /api/categories/[id] - Delete category
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const supabase = await createClient();

    // Check if category exists
    const { error: fetchError } = await supabase
      .from(CATEGORIES_TABLE)
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === NO_ROWS_ERROR_CODE) {
        throw new NotFoundError('Category not found');
      }
      throw new DatabaseError(`Failed to fetch category: ${fetchError.message}`, fetchError.code);
    }

    // Delete category (products will have category_id set to NULL due to ON DELETE SET NULL)
    const { error: deleteError } = await supabase
      .from(CATEGORIES_TABLE)
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new DatabaseError(`Failed to delete category: ${deleteError.message}`, deleteError.code);
    }

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


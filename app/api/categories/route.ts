import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { generateSlug, generateUniqueSlug } from '@/utils/slug';
import { AuthenticationError, ValidationError, DatabaseError } from '@/lib/errors';

const CATEGORIES_TABLE = 'categories';

/**
 * GET /api/categories - List all categories
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new DatabaseError(`Failed to fetch categories: ${error.message}`, error.code);
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/categories - Create new category
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, description, slug } = body;

    if (!name?.trim()) {
      throw new ValidationError('Category name is required');
    }

    const supabase = await createClient();

    // Generate unique slug if not provided
    let finalSlug = slug?.trim() || generateSlug(name);
    const { data: existingCategories } = await supabase
      .from(CATEGORIES_TABLE)
      .select('slug');

    if (existingCategories) {
      const existingSlugs = existingCategories.map((c) => c.slug);
      finalSlug = generateUniqueSlug(finalSlug, existingSlugs);
    }

    // Check if name already exists
    const { data: existingName } = await supabase
      .from(CATEGORIES_TABLE)
      .select('id')
      .eq('name', name.trim())
      .single();

    if (existingName) {
      throw new ValidationError('Category with this name already exists');
    }

    // Insert category
    const { data, error: insertError } = await supabase
      .from(CATEGORIES_TABLE)
      .insert({
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      throw new DatabaseError(`Failed to create category: ${insertError.message}`, insertError.code);
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


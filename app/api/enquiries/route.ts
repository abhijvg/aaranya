import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';
import { CreateEnquiryInput } from '@/types/enquiry';

const ENQUIRIES_TABLE = 'enquiries';

/**
 * GET /api/enquiries - Get all enquiries (admin only)
 * Query params: product_id (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    const supabase = await createClient();

    let query = supabase
      .from(ENQUIRIES_TABLE)
      .select(`
        *,
        product:products(id, name, slug, price, offer_price)
      `)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching enquiries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enquiries' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/enquiries:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

/**
 * POST /api/enquiries - Create new enquiry (public)
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateEnquiryInput = await request.json();
    const { product_id, description, customer_name, customer_phone, customer_email } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from(ENQUIRIES_TABLE)
      .insert({
        product_id,
        description: description || null,
        customer_name: customer_name || null,
        customer_phone: customer_phone || null,
        customer_email: customer_email || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating enquiry:', error);
      return NextResponse.json(
        { error: 'Failed to create enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}


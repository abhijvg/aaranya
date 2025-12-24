import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';
import { UpdateEnquiryInput } from '@/types/enquiry';

const ENQUIRIES_TABLE = 'enquiries';

/**
 * GET /api/enquiries/[id] - Get single enquiry (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(ENQUIRIES_TABLE)
      .select(`
        *,
        product:products(id, name, slug, price, offer_price)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching enquiry:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enquiry' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/enquiries/[id]:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

/**
 * PATCH /api/enquiries/[id] - Update enquiry (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const body: UpdateEnquiryInput = await request.json();
    const { status, description, notes, customer_name, customer_phone, customer_email } = body;

    const supabase = await createClient();

    const updateData: Partial<UpdateEnquiryInput> = {};
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;
    if (customer_name !== undefined) updateData.customer_name = customer_name;
    if (customer_phone !== undefined) updateData.customer_phone = customer_phone;
    if (customer_email !== undefined) updateData.customer_email = customer_email;

    const { data, error } = await supabase
      .from(ENQUIRIES_TABLE)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        product:products(id, name, slug, price, offer_price)
      `)
      .single();

    if (error) {
      console.error('Error updating enquiry:', error);
      return NextResponse.json(
        { error: 'Failed to update enquiry' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/enquiries/[id]:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/enquiries/[id] - Delete enquiry (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from(ENQUIRIES_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting enquiry:', error);
      return NextResponse.json(
        { error: 'Failed to delete enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/enquiries/[id]:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}


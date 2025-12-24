export type EnquiryStatus = 'pending' | 'contacted' | 'sale_done' | 'sale_failed' | 'cancelled';

export interface Enquiry {
  id: string;
  product_id: string;
  status: EnquiryStatus;
  description: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    offer_price: number | null;
  };
}

export interface CreateEnquiryInput {
  product_id: string;
  description?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
}

export interface UpdateEnquiryInput {
  status?: EnquiryStatus;
  description?: string | null;
  notes?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
}


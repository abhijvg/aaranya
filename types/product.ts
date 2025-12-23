export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  offer_price: number | null;
  images: string[];
  video_url: string | null;
  category_id: string | null;
  created_at: string;
  updated_at?: string;
  // Joined category data (optional, populated when needed)
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}



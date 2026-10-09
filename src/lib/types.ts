export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  featured?: boolean;
  active?: boolean;
  sort_order?: number;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  published?: boolean;
  // Firestore Timestamp, ISO string, or missing
  created_at?: any;
  published_at?: any;
};

export type Homepage = {
  hero_image_url?: string;
  hero_title?: string;
  hero_sub?: string;
  hero_tag?: string;
  delivery_eta?: string;
  menu_sub?: string;
  loc_short?: string;
  loc_full?: string;
  loc_city?: string;
  phone?: string;
  whatsapp_num?: string;
};

export type CartLine = { name: string; price: number; img: string; qty: number };

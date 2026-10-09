import type { BlogPost, Homepage, MenuItem } from '@/lib/types';

// Shown when Firestore is empty or unreachable (same as the web app)
export const FALLBACK_MENU: MenuItem[] = [
  { id: 'f1', name: 'Jollof Rice & Chicken', price: 5500, image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&auto=format&fit=crop&q=70', description: 'Party jollof, smoky & spiced', category: 'mains', featured: true },
  { id: 'f2', name: 'Beef Suya (Half Stick)', price: 2500, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=70', description: 'Northern-style skewered beef', category: 'suya', featured: true },
  { id: 'f3', name: 'Chicken Shawarma', price: 3200, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=70', description: 'Grilled chicken, garlic sauce & veggies', category: 'shawarma', featured: false },
  { id: 'f4', name: 'Zobo Drink (500ml)', price: 800, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=70', description: 'Hibiscus, ginger & lemon', category: 'drinks', featured: false },
  { id: 'f5', name: 'Fried Plantain (Dodo)', price: 1200, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=70', description: 'Sweet ripe plantain, golden-fried', category: 'sides', featured: false },
];

export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'fake-001',
    title: 'The Secret Behind Our Smoky Party Jollof',
    excerpt:
      'Everyone asks — what makes Isebe jollof taste like a celebration every single time? We finally decided to share (some of) the magic.',
    cover_image_url:
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=900&auto=format&fit=crop&q=80',
    created_at: '2026-06-20T10:00:00Z',
    published: true,
    content: `There's a reason people drive from Surulere, Lekki, and even Abuja just to taste our jollof rice. It's not magic — well, maybe a little.

The foundation: the right tomato base
It all starts with a slow-cooked tomato, tatashe, and onion blend. We fry it low and slow for nearly 45 minutes until the raw smell is completely gone and the oil floats on top. That's when you know it's ready. Most people rush this step. We never do.

The firewood effect (and how we recreate it)
Authentic party jollof gets its smoky depth from open firewood cooking. In our kitchen, we achieve the same result by cranking the heat at the very end and letting the bottom of the pot catch slightly — that's the socata, the coveted crust Nigerians fight over. The smoke rises and infuses the entire pot.

Our spice blend
We won't give you the full recipe — come on, we still have a business to run 😄 — but the short version is: a combination of Nigerian curry, thyme, bay leaves, stock cubes, and one ingredient we'll keep secret for now.

The rice ratio
Too much water and your jollof turns mushy. Too little and it burns before it's cooked. Our ratio took months of testing to perfect. We parboil the rice just enough so it finishes cooking in the sauce, absorbing every bit of flavour along the way.

Why it tastes like a party
Party jollof hits different because it's cooked in large quantities outdoors, slowly, with constant heat management. We've studied that process and worked hard to bring it into our kitchen without losing anything.

Next time you order, close your eyes when you take the first bite. If you don't hear music and smell suya in the air, we haven't done our job right.

Come taste it yourself — we're open every day, 8 AM to 10 PM at 12 Herbert Macaulay Way, Yaba, Lagos. Or just order via WhatsApp 🙌`,
  },
];

export const DEFAULT_HOMEPAGE: Required<Homepage> = {
  hero_image_url:
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&auto=format&fit=crop&q=80',
  hero_title: 'ISEBE',
  hero_sub: 'Best Jollof · Suya · Shawarma\nAuthentic Lagos flavour, delivered.',
  hero_tag: 'Open now · Yaba, Lagos',
  delivery_eta: '20–30 min',
  menu_sub: "Everything we're cooking today",
  loc_short: '12 Herbert Macaulay Way, Yaba, Lagos',
  loc_full: '12 Herbert Macaulay Way, Yaba,\nLagos 101212, Lagos State, Nigeria',
  loc_city: 'Yaba, Lagos',
  phone: '+234 800 000 0000',
  // Replace with the real number (digits only) or set it from the admin Homepage tab
  whatsapp_num: '2348000000000',
};

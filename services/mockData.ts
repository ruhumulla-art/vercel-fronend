
import { Product, User, Order } from '../types';

// Mock Data Service
// Optimized with high-resolution image URLs for retina displays

const GENERIC_FEATURES = [
  "Adjustable & Detachable Crossbody Strap",
  "14 Inch Padded Laptop Compartment",
  "Zipper Closure",
  "4 Slip Pockets & 3 Card Slots With Pen Holders",
  "Water-resistant interior lining",
  "Gold-tone hardware finish"
];

// Base Unsplash URL helper for consistent quality
const getHighRes = (url: string) => {
  // Ensure we request high quality and width, stripping any existing params
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&q=100&w=1600`;
};

// Thumbnail helper for smaller images (still sharp, but smaller file size)
const getThumb = (url: string) => {
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&q=90&w=400`;
};

// Helper to create product variants easily
const createProduct = (
  id: string,
  name: string,
  price: number,
  category: string,
  collection: string,
  imageUrl: string,
  originalPrice?: number,
  trending: boolean = false
): Product => ({
  id,
  name,
  price,
  originalPrice,
  description: 'Handcrafted with precision, this piece from Lora Halle embodies timeless elegance. Featuring premium materials and functional design, it is the perfect companion for the modern woman.',
  category,
  collection,
  image: getHighRes(imageUrl),
  trending,
  colors: [
    getThumb(imageUrl),
    getThumb('https://images.unsplash.com/photo-1594223274512-ad4803739b7c'),
    getThumb('https://images.unsplash.com/photo-1550523419-e37456d9a594')
  ],
  features: GENERIC_FEATURES
});

// 8 Products per major category (Tote, Top Handle, Laptop, Crossbody, Shoulder, Hobo, Mini, Clutch)
// Total 64+ products

export const PRODUCTS: Product[] = [
  // --- TOTE BAGS (8) ---
  createProduct('tote-1', 'Denice 2.0 Tote', 4319, 'Tote Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 5999, true),
  createProduct('tote-2', 'Martina Classic Tote', 4124, 'Tote Bags', 'Nylon Collection', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 5499),
  createProduct('tote-3', 'Dakota Canvas Tote', 3299, 'Tote Bags', 'Nylon Collection', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 4999),
  createProduct('tote-4', 'Ace Structured Tote', 4499, 'Tote Bags', 'Capsule Collection', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1', 5999, true),
  createProduct('tote-5', 'Bella Large Tote', 3899, 'Tote Bags', 'The Invite', 'https://images.unsplash.com/photo-1618221639211-c750eb26244f', 4500),
  createProduct('tote-6', 'Florence Leather Tote', 6999, 'Tote Bags', 'Le Tweed', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 8999),
  createProduct('tote-7', 'Siena Everyday Tote', 2999, 'Tote Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 3999),
  createProduct('tote-8', 'Capri Summer Tote', 3499, 'Tote Bags', 'Summer Scoop', 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf', 4299),

  // --- TOP HANDLE BAGS (8) ---
  createProduct('top-handle-1', 'Royal Satchel', 2100, 'Top Handle Bags', 'Le Tweed', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 2500, true),
  createProduct('top-handle-2', 'Victoria Top Handle', 3500, 'Top Handle Bags', 'Fierce Collection', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 4200),
  createProduct('top-handle-3', 'Elizabeth Box Bag', 4200, 'Top Handle Bags', 'Lora Halle & Deme', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1', 5500),
  createProduct('top-handle-4', 'Diana Structured Bag', 3800, 'Top Handle Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 4900),
  createProduct('top-handle-5', 'Margaret Leather Bag', 5600, 'Top Handle Bags', 'Corporate Gifting', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 6800),
  createProduct('top-handle-6', 'Catherine Satchel', 3100, 'Top Handle Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c', 3900),
  createProduct('top-handle-7', 'Anne Classic Bag', 2800, 'Top Handle Bags', 'Summer Scoop', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 3400),
  createProduct('top-handle-8', 'Grace Elegant Handle', 4500, 'Top Handle Bags', 'Holiday Collection', 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf', 5200),

  // --- LAPTOP BAGS (8) ---
  createProduct('laptop-1', 'Bianca Executive', 5249, 'Laptop Bags', 'Corporate Gifting', 'https://images.unsplash.com/photo-1550523419-e37456d9a594', 6999, true),
  createProduct('laptop-2', 'Olivia Work Tote', 4800, 'Laptop Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 6000),
  createProduct('laptop-3', 'Sophia Tech Bag', 4500, 'Laptop Bags', 'Nylon Collection', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 5500),
  createProduct('laptop-4', 'Emma Professional', 5100, 'Laptop Bags', 'Corporate Gifting', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1', 6200),
  createProduct('laptop-5', 'Ava Commuter', 3900, 'Laptop Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c', 4800),
  createProduct('laptop-6', 'Isabella Briefcase', 5800, 'Laptop Bags', 'Le Tweed', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 7000),
  createProduct('laptop-7', 'Mia Laptop Sleeve', 2500, 'Laptop Bags', 'Capsule Collection', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 3200),
  createProduct('laptop-8', 'Charlotte Document Bag', 4900, 'Laptop Bags', 'The Invite', 'https://images.unsplash.com/photo-1618221639211-c750eb26244f', 5900),

  // --- CROSSBODY BAGS (8) ---
  createProduct('crossbody-1', 'Sienna Crossbody', 1450, 'Crossbody Bags', 'Summer Scoop', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 1600, true),
  createProduct('crossbody-2', 'Luna Moon Bag', 1800, 'Crossbody Bags', 'Holiday Collection', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 2200),
  createProduct('crossbody-3', 'Aria Camera Bag', 2100, 'Crossbody Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c', 2600),
  createProduct('crossbody-4', 'Zoey Box Sling', 1950, 'Crossbody Bags', 'Fierce Collection', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 2500),
  createProduct('crossbody-5', 'Chloe Chain Strap', 2400, 'Crossbody Bags', 'Lora Halle & Deme', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 3000),
  createProduct('crossbody-6', 'Ruby Quilted', 2800, 'Crossbody Bags', 'Le Tweed', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 3500),
  createProduct('crossbody-7', 'Lily Everyday Sling', 1600, 'Crossbody Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf', 1900),
  createProduct('crossbody-8', 'Maya Festival Bag', 1750, 'Crossbody Bags', 'Summer Scoop', 'https://images.unsplash.com/photo-1631160375685-64555db657dc', 2100),

  // --- SHOULDER BAGS (8) ---
  createProduct('shoulder-1', 'Paris Shoulder Bag', 2900, 'Shoulder Bags', 'The Invite', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 3500),
  createProduct('shoulder-2', 'London Chain Bag', 3200, 'Shoulder Bags', 'Le Tweed', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 4000),
  createProduct('shoulder-3', 'Milan Ruched Bag', 2600, 'Shoulder Bags', 'Fierce Collection', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 3200, true),
  createProduct('shoulder-4', 'New York Hobo', 2800, 'Shoulder Bags', 'Capsule Collection', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 3600),
  createProduct('shoulder-5', 'Tokyo Minimalist', 2400, 'Shoulder Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1', 2900),
  createProduct('shoulder-6', 'Sydney Casual', 2200, 'Shoulder Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 2800),
  createProduct('shoulder-7', 'Dubai Luxury', 3800, 'Shoulder Bags', 'Holiday Collection', 'https://images.unsplash.com/photo-1618221639211-c750eb26244f', 4800),
  createProduct('shoulder-8', 'Rome Classic', 3100, 'Shoulder Bags', 'Corporate Gifting', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 3900),

  // --- HOBO BAGS (8) ---
  createProduct('hobo-1', 'Hobo Chic', 1350, 'Hobo Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c', 1500),
  createProduct('hobo-2', 'Boho Dream', 2200, 'Hobo Bags', 'Summer Scoop', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 2800),
  createProduct('hobo-3', 'Slouchy Luxe', 2900, 'Hobo Bags', 'The Invite', 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf', 3600),
  createProduct('hobo-4', 'Crescent Moon', 2500, 'Hobo Bags', 'Capsule Collection', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1', 3200, true),
  createProduct('hobo-5', 'Vintage Vibe', 2100, 'Hobo Bags', 'Fierce Collection', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 2700),
  createProduct('hobo-6', 'Urban Wanderer', 2700, 'Hobo Bags', 'Nylon Collection', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 3400),
  createProduct('hobo-7', 'Suede Soft', 3100, 'Hobo Bags', 'Le Tweed', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 3900),
  createProduct('hobo-8', 'Everyday Slouch', 1900, 'Hobo Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 2400),

  // --- MINI BAGS (8) ---
  createProduct('mini-1', 'Bree Mini', 1999, 'Mini Bags', 'Summer Scoop', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 2499, true),
  createProduct('mini-2', 'Pixie Micro', 1500, 'Mini Bags', 'Holiday Collection', 'https://images.unsplash.com/photo-1631160375685-64555db657dc', 1900),
  createProduct('mini-3', 'Tiny Tote', 1800, 'Mini Bags', 'Capsule Collection', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c', 2200),
  createProduct('mini-4', 'Petit Satchel', 2100, 'Mini Bags', 'The Minimalist', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 2600),
  createProduct('mini-5', 'Nano Crossbody', 1600, 'Mini Bags', 'Beyond Basics', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 2000),
  createProduct('mini-6', 'Micro Chain', 2400, 'Mini Bags', 'Fierce Collection', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 3000),
  createProduct('mini-7', 'Baby Bucket', 1700, 'Mini Bags', 'Lora Halle & Deme', 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf', 2100),
  createProduct('mini-8', 'Little Luxe', 2300, 'Mini Bags', 'The Invite', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 2900),

  // --- CLUTCHES (8) ---
  createProduct('clutch-1', 'Midnight Velvet', 890, 'Clutches', 'Holiday Collection', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', 1200, true),
  createProduct('clutch-2', 'Gold Hour', 1200, 'Clutches', 'The Invite', 'https://images.unsplash.com/photo-1616782415714-239632832569', 1600),
  createProduct('clutch-3', 'Envelope Sleek', 950, 'Clutches', 'Corporate Gifting', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c', 1300),
  createProduct('clutch-4', 'Crystal Evening', 2500, 'Clutches', 'Lora Halle & Deme', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 3200),
  createProduct('clutch-5', 'Pearl Box', 2800, 'Clutches', 'Fierce Collection', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1', 3500),
  createProduct('clutch-6', 'Satin Bow', 1500, 'Clutches', 'Capsule Collection', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 1900),
  createProduct('clutch-7', 'Leather Wristlet', 1100, 'Clutches', 'The Minimalist', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 1500),
  createProduct('clutch-8', 'Oversized Day Clutch', 1800, 'Clutches', 'Beyond Basics', 'https://images.unsplash.com/photo-1618221639211-c750eb26244f', 2400),
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Sophia Laurent',
  email: 'sophia@lorahalle.com',
  role: 'user',
  avatar: getThumb('https://images.unsplash.com/photo-1494790108377-be9c29b29330')
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7721',
    date: '2023-10-24',
    total: 2140.00,
    status: 'Delivered',
    items: []
  },
  {
    id: 'ORD-7789',
    date: '2023-11-01',
    total: 890.00,
    status: 'Shipped',
    items: []
  }
];

// Optimized async fetchers (simulating Server Actions)
export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(PRODUCTS), 400));
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => setTimeout(() => resolve(PRODUCTS.find(p => p.id === id)), 200));
};

export const fetchUser = async (): Promise<User> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_USER), 300));
};

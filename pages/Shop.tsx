
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/mockData';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { Filter, ChevronDown, AlertCircle } from 'lucide-react';

// Category Content Configuration (Images & Descriptions)
const CATEGORY_CONTENT: Record<string, { image: string, description: string }> = {
  'Tote Bags': {
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200',
    description: 'Discover our versatile collection of Tote Bags, designed for the modern woman who carries her world with her. From structured office totes to relaxed weekend styles, find the perfect blend of functionality and fashion.'
  },
  'Top Handle Bags': {
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=1200',
    description: 'Elevate your style with Miraggio handbags. From chic styles for evening soirees to spacious bags for your everyday essentials, find the perfect companion to complement your look.'
  },
  'Laptop Bags': {
     image: 'https://images.unsplash.com/photo-1550523419-e37456d9a594?auto=format&fit=crop&q=80&w=1200',
     description: 'Work anywhere in style with our sophisticated Laptop Bags. Features padded compartments, organized pockets, and durable materials without compromising on elegance.'
  },
  'Crossbody Bags': {
     image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200',
     description: 'Keep your hands free and your style on point with our Crossbody Bags. Perfect for days on the go, these compact yet spacious bags are your ultimate daily companions.'
  },
  'Shoulder Bags': {
     image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
     description: 'Classic silhouettes meet modern design in our Shoulder Bags collection. Effortlessly chic and comfortable to carry, these bags are staples for any wardrobe.'
  },
  'Clutches': {
     image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=1200',
     description: 'Make a statement at your next event with our exquisite Clutches. Designed to hold your essentials while adding a touch of glamour to your evening attire.'
  }
};

const DEFAULT_CONTENT = {
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200',
    description: 'Explore our latest collection of premium handbags and accessories. Timeless designs crafted with care for every occasion.'
};

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Get filters from URL
  const categoryFilter = searchParams.get('category');
  const collectionFilter = searchParams.get('collection');
  const activeFilter = searchParams.get('filter'); // e.g., 'trending'

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchProducts()
      .then(data => {
        if (mounted) {
          setProducts(data || []); // Safety fallback
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          console.error("API Error:", err);
          setError("We couldn't load the products at this time. Please try again.");
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  // Filter Logic with defensive checks
  const filteredProducts = products.filter(p => {
    if (!p) return false;
    if (categoryFilter && categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (collectionFilter && p.collection !== collectionFilter) return false;
    if (activeFilter === 'trending' && !p.trending) return false;
    return true;
  });

  // Display Logic
  const displayTitle = collectionFilter || categoryFilter || (activeFilter === 'trending' ? 'Best Sellers' : 'All Products');
  const content = (categoryFilter && categoryFilter !== 'All') 
    ? (CATEGORY_CONTENT[categoryFilter] || DEFAULT_CONTENT)
    : DEFAULT_CONTENT;

  if (!categoryFilter || categoryFilter === 'All') {
     content.description = "Browse our complete range of luxury handbags, designed in Florence and crafted for the modern muse.";
  }

  return (
    <div className="max-w-[1440px] mx-auto pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="animate-fade-in mb-8 md:mb-12">
         {/* Image Banner - Full Width on Mobile */}
         <div className="w-full aspect-[4/3] md:aspect-[2.5/1] lg:aspect-[3/1] overflow-hidden bg-stone-100 relative">
             <img 
               src={content.image} 
               alt={displayTitle} 
               className="w-full h-full object-cover object-center" 
             />
             <div className="absolute inset-0 bg-black/10"></div>
         </div>
         
         {/* Text Content */}
         <div className="px-4 md:px-8 mt-6 max-w-4xl mx-auto text-left">
            <h1 className="text-xl md:text-3xl font-bold text-stone-900 mb-2">
              {displayTitle} <span className="text-stone-500 text-sm md:text-lg font-sans font-normal">({loading ? '...' : filteredProducts.length} items)</span>
            </h1>
            
            <div className="text-sm md:text-base text-stone-600 leading-relaxed font-light md:max-w-2xl">
               <p className={`${isDescriptionExpanded ? '' : 'line-clamp-2 md:line-clamp-none'} transition-all`}>
                  {content.description}
               </p>
               {/* Read More Toggle */}
               <button 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="md:hidden text-stone-900 font-bold underline mt-1 text-xs uppercase tracking-wider"
               >
                  {isDescriptionExpanded ? 'Read Less' : 'Read more'}
               </button>
            </div>
         </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <div className="px-4 md:px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {[1,2,3,4,5,6,7,8].map(n => (
               <div key={n} className="bg-stone-50 aspect-[4/5] animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
           <div className="text-center py-20 bg-red-50 rounded-lg mx-auto max-w-2xl border border-red-100">
             <AlertCircle size={32} className="mx-auto text-red-400 mb-3" />
             <p className="text-stone-900 font-serif italic text-xl mb-2">Something went wrong</p>
             <p className="text-stone-500 text-sm">{error}</p>
             <button 
               onClick={() => window.location.reload()}
               className="mt-6 px-8 py-3 border border-stone-900 text-stone-900 uppercase text-xs font-bold tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
             >
               Refresh Page
             </button>
           </div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-lg mx-auto max-w-2xl">
                <p className="text-stone-900 font-serif italic text-xl mb-2">No items found.</p>
                <p className="text-stone-500 text-sm">Try selecting a different category or collection.</p>
                <button 
                onClick={() => setSearchParams({})}
                className="mt-6 px-8 py-3 border border-stone-900 text-stone-900 uppercase text-xs font-bold tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
                >
                View All Products
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-8 md:gap-y-12">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

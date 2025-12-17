
import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
            <Heart size={32} className="text-stone-300" />
        </div>
        <h2 className="text-3xl font-serif text-stone-900 mb-4">Your Wishlist is Empty</h2>
        <p className="text-stone-500 mb-8 font-light max-w-md">
            Save items you love here. Review them anytime and easily move them to the bag.
        </p>
        <Link to="/shop" className="px-8 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif text-stone-900 mb-2">My Wishlist</h1>
        <p className="text-stone-500 font-light">{wishlist.length} Items</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

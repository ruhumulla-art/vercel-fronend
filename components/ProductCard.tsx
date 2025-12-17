
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Combine main image and color variants for thumbnails, limit to 4
  const images = [product.image, ...(product.colors || [])].slice(0, 3);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group relative bg-white flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F6F6F6] mb-3">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img 
            src={activeImage} 
            alt={product.name} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
        </Link>
        
        {/* Heart Icon (Top Right) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 transition-colors z-10 ${inWishlist ? 'text-red-500' : 'text-stone-900 hover:text-red-500'}`}
        >
            <Heart size={20} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Bag Icon (Bottom Right) */}
        <button 
            onClick={(e) => {
                e.preventDefault();
                addToCart(product);
            }}
            className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full text-stone-900 shadow-sm hover:bg-stone-900 hover:text-white transition-colors z-10"
        >
            <ShoppingBag size={18} strokeWidth={1.5} />
        </button>

        {/* Bestseller / Sold Out Badge */}
        {product.trending && (
           <div className="absolute top-0 left-0 bg-stone-100/90 text-[9px] font-bold px-2 py-1 uppercase tracking-wider text-stone-900">
              Bestseller
           </div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-2 mb-2 px-0.5">
         {images.map((img, idx) => (
            <button
               key={idx}
               onClick={(e) => {
                   e.preventDefault();
                   setActiveImage(img);
               }}
               className={`w-8 h-8 border ${activeImage === img ? 'border-stone-900' : 'border-stone-200'} p-0.5 transition-colors`}
            >
               <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
         ))}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-0.5">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-stone-900 text-sm font-normal leading-tight mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center flex-wrap gap-2 text-sm mt-auto">
            <span className="font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
                <>
                    <span className="text-stone-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-stone-900 font-bold text-xs">{discountPercentage}% OFF</span>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

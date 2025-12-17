
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, cartTotal, addToCart } = useStore();
  const [upsellProducts] = useState(PRODUCTS.slice(0, 2));

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const discountAmount = 975;
  const finalTotal = cartTotal > 0 ? cartTotal - discountAmount : 0;
  const savings = 6225;

  return (
    <div className="fixed inset-0 z-[300] flex justify-end">
      {/* Backdrop - Removed backdrop-blur-sm to prevent blurring the main page */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer - Standardized max-width to 380px */}
      <div className="relative w-full max-w-[380px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-white z-10">
          <h2 className="text-lg font-serif font-medium text-stone-900">Shopping Bag ({cart.length})</h2>
          <button onClick={closeCart} className="text-stone-400 hover:text-stone-900 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
           
           {/* Progress Bar Section */}
           <div className="px-6 pt-6 pb-4">
              <p className="text-xs text-stone-600 mb-2 font-medium">Add ₹850 more to avail extra 10% off.</p>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                 <div className="h-full bg-stone-900 w-[70%] rounded-full"></div>
              </div>
              <div className="text-right mt-1">
                 <span className="text-[10px] text-stone-400 font-bold">10% OFF</span>
              </div>
           </div>

           {/* Cart Items */}
           <div className="px-6 space-y-6 mb-8">
              {cart.length === 0 ? (
                 <div className="text-center py-10">
                    <ShoppingBag size={32} className="mx-auto text-stone-300 mb-3" />
                    <p className="text-stone-500 text-sm">Your bag is empty.</p>
                 </div>
              ) : (
                cart.map(item => {
                  const itemDiscountPercent = item.originalPrice 
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
                    : 0;
                  
                  return (
                    <div key={item.id} className="flex gap-4 border-b border-stone-100 pb-6 last:border-0">
                       <div className="w-20 h-24 bg-[#F6F6F6] flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                          />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide pr-2">{item.name}</h3>
                             <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-stone-400 underline hover:text-stone-900">Remove</button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-1 text-xs">
                             <span className="font-bold text-stone-900">₹{item.price.toLocaleString()}</span>
                             {item.originalPrice && (
                                <>
                                  <span className="text-stone-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                                  <span className="text-green-700 font-bold">{itemDiscountPercent}% OFF</span>
                                </>
                             )}
                          </div>
                          
                          <p className="text-[10px] text-stone-500 mb-3">Color: Gold</p>

                          <div className="flex items-center w-max border border-stone-200">
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               disabled={item.quantity <= 1}
                               className="p-1.5 text-stone-500 hover:bg-stone-50 disabled:opacity-30"
                             >
                                <Minus size={12} />
                             </button>
                             <span className="w-6 text-center text-xs font-medium text-stone-900">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               className="p-1.5 text-stone-500 hover:bg-stone-50"
                             >
                                <Plus size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                  );
                })
              )}
           </div>

           {/* Upsell */}
           <div className="bg-stone-50 p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-medium text-stone-900">Pairs Well With</h3>
                 <span className="text-stone-400 text-lg tracking-widest leading-none pb-2">...</span>
              </div>
              <div className="space-y-4">
                 {upsellProducts.map((prod) => {
                    const discount = prod.originalPrice 
                        ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) 
                        : 0;

                    return (
                        <div key={prod.id} className="flex gap-4 bg-white p-3 shadow-sm border border-stone-100 items-center">
                            <div className="w-12 h-12 bg-[#F6F6F6] flex-shrink-0">
                                <img 
                                    src={prod.image} 
                                    alt={prod.name} 
                                    className="w-full h-full object-contain p-1"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-bold text-stone-900 uppercase truncate mb-0.5">{prod.name}</h4>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                    <span className="font-bold text-stone-900">₹{prod.price.toLocaleString()}</span>
                                    {prod.originalPrice && <span className="text-stone-400 line-through">₹{prod.originalPrice.toLocaleString()}</span>}
                                    {prod.originalPrice && <span className="text-green-700 font-bold">{discount}% OFF</span>}
                                </div>
                            </div>
                            <button 
                                onClick={() => addToCart(prod)}
                                className="text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white border border-stone-900 px-3 py-1.5 hover:bg-stone-700 hover:border-stone-700 transition-all whitespace-nowrap"
                            >
                                Add to cart
                            </button>
                        </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="flex justify-between items-center mb-3 text-xs">
              <span className="text-stone-900 font-bold uppercase text-[10px]">Total</span>
              <span className="text-xl font-bold text-stone-900">₹{finalTotal.toLocaleString()}</span>
           </div>
           
           <div className="bg-stone-50 text-center py-2 mb-4">
              <p className="text-xs text-stone-600">You save <span className="font-bold text-green-700">₹{savings.toLocaleString()}</span> on this order.</p>
           </div>

           <Link 
             to="/checkout" 
             onClick={closeCart}
             className="block w-full bg-black text-white text-center py-4 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
           >
              PLACE ORDER
           </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

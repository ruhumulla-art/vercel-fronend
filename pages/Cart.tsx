
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

// Cart Page
// Minimal list view

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-serif text-stone-900 mb-4">Your Bag is Empty</h2>
        <p className="text-stone-500 mb-8 font-light">Explore our collection to find your perfect piece.</p>
        <Link to="/shop" className="px-8 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors">
          View Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
      <h1 className="text-3xl font-serif text-stone-900 mb-12 text-center">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="border-b border-stone-100 pb-8 flex gap-6 items-center">
              <div className="w-24 h-32 bg-stone-50 overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-stone-900 font-serif text-lg">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-stone-500 text-xs uppercase tracking-wider mb-4">{item.category}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 border border-stone-200 px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-30">
                      <Minus size={14} />
                    </button>
                    <span className="text-stone-900 text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-stone-400 hover:text-stone-900">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-stone-900 font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-50 p-8">
            <h2 className="text-lg font-serif text-stone-900 mb-6 border-b border-stone-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-stone-600 font-light">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600 font-light">
                <span>Shipping</span>
                <span className="text-stone-900">Complimentary</span>
              </div>
              <div className="flex justify-between text-stone-600 font-light">
                <span>Est. Tax</span>
                <span>₹{(cartTotal * 0.08).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-stone-900 font-bold uppercase tracking-widest text-sm">Total</span>
                <span className="text-xl font-serif text-stone-900">₹{Math.round(cartTotal * 1.08).toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors text-sm">
              Proceed to Checkout
            </Link>
            
            <div className="mt-6 text-center space-y-2">
               <p className="text-stone-400 text-xs">Secure Encrypted Checkout</p>
               <p className="text-stone-400 text-xs">30-Day Complimentary Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
// Step 2 का Import यहाँ है
import { saveOrder } from '../services/firestoreService'; 

const Checkout = () => {
  const { cartTotal, clearCart, cart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Final Firebase Logic यहाँ है
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // firestoreService फंक्शन को कॉल कर रहे हैं
      const result = await saveOrder(cart, cartTotal);

      if (result.success) {
        setIsProcessing(false);
        clearCart();
        alert("Order Placed Successfully! Order ID: " + result.id);
        navigate('/dashboard');
      } else {
        throw new Error("Firebase save failed");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24">
      <div className="text-center mb-10">
         <h1 className="text-3xl font-serif text-stone-900">Checkout</h1>
      </div>

      <form onSubmit={handlePayment} className="space-y-12">
        {/* Shipping Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-2">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <input type="text" placeholder="First Name" className="bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required />
             <input type="text" placeholder="Last Name" className="bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required />
             <input type="text" placeholder="Street Address" className="md:col-span-2 bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required />
             <input type="text" placeholder="City" className="bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required />
             <input type="text" placeholder="Zip Code" className="bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required />
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-2">Payment Details</h2>
          <div className="space-y-6">
             <input type="text" placeholder="Card Number" className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required maxLength={19} />
             <div className="grid grid-cols-2 gap-6">
               <input type="text" placeholder="MM/YY" className="bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required maxLength={5} />
               <input type="text" placeholder="CVC" className="bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" required maxLength={4} />
             </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold uppercase tracking-widest py-4 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Processing...
            </>
          ) : (
            `Complete Purchase (₹${Math.round(cartTotal * 1.08).toLocaleString()})`
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
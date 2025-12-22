import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { saveOrder } from '../services/firestoreService'; 

const Checkout = () => {
  const { cartTotal, clearCart, cart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("💳 Checkout: Payment button clicked!");
    setIsProcessing(true);

    try {
      // ऑर्डर्स को सेव करना
      const result = await saveOrder(cart, cartTotal);

      if (result.success) {
        setIsProcessing(false);
        clearCart();
        alert("Order Placed Successfully! ID: " + result.id);
        navigate('/dashboard');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("❌ Order Error:", error);
      alert("Something went wrong: " + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <form onSubmit={handlePayment} className="space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {/* ... बाकी इनपुट फ़ील्ड्स ... */}
        <button 
          type="submit" 
          disabled={isProcessing}
          className="w-full bg-black text-white py-4 flex items-center justify-center gap-2"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : `Pay ₹${Math.round(cartTotal * 1.08)}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, PlusCircle, Image as ImageIcon, Tag, DollarSign, ShoppingCart, LayoutDashboard, Clock, User } from 'lucide-react';

// Hooks इम्पोर्ट करें
import { useAdminAuth } from '../Hook/useAdminAuth'; 
import { useAdminData } from '../Hook/useAdminData';

const Admin = () => {
  const { isAdmin, checking } = useAdminAuth(); 
  const { data: products } = useAdminData('products'); 
  const { data: orders } = useAdminData('orders'); 

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({ name: '', price: '', image: '', description: '', category: 'Handbags' });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...product,
        price: Number(product.price),
        createdAt: serverTimestamp()
      });
      alert("Product added successfully!");
      setProduct({ name: '', price: '', image: '', description: '', category: 'Handbags' });
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* --- सांख्यिकी कार्ड्स (Stats) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-4 bg-stone-50 rounded-xl text-stone-600"><LayoutDashboard size={24} /></div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Inventory</p>
              <h3 className="text-2xl font-bold text-stone-900">{products.length} Products</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-4 bg-stone-50 rounded-xl text-stone-600"><ShoppingCart size={24} /></div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Total Business</p>
              <h3 className="text-2xl font-bold text-stone-900">{orders.length} Orders</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- लेफ्ट साइड: प्रोडक्ट फॉर्म --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 sticky top-10">
              <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-stone-400" /> New Item
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="Name" required className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900" 
                  value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} />
                
                <input type="number" placeholder="Price" required className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900" 
                  value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} />
                
                <input type="text" placeholder="Image URL" required className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900" 
                  value={product.image} onChange={(e) => setProduct({...product, image: e.target.value})} />
                
                <textarea placeholder="Description" rows={3} className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900" 
                  value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} />
                
                <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Publish"}
                </button>
              </form>
            </div>
          </div>

          {/* --- राइट साइड: ऑर्डर्स टेबल --- */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 min-h-[500px]">
              <h2 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-stone-400" /> Recent Sales
              </h2>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 border border-stone-50 rounded-xl hover:bg-stone-50 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-stone-400">#{order.id.slice(0,8)}...</span>
                      <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded text-[9px] uppercase font-bold tracking-tighter">
                        {order.orderStatus || 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400"><User size={14} /></div>
                      <div>
                        <p className="text-sm font-medium text-stone-800">{order.customerId || 'Guest'}</p> {/* */}
                        <p className="text-[10px] text-stone-400">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Date N/A'} {/* */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-center py-20 text-stone-300 italic text-sm">No sales records yet.</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
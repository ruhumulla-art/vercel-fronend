import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, PlusCircle, Image as ImageIcon, Tag, DollarSign, LayoutDashboard, ShoppingCart } from 'lucide-react';

// --- STEP 1: Hooks को इम्पोर्ट करें (इन्हें फाइल के सबसे ऊपर रखें) ---
import { useAdminAuth } from '../Hook/useAdminAuth'; 
import { useAdminData } from '../Hook/useAdminData';

const Admin = () => {
  // --- STEP 2: Hooks को फंक्शन के अंदर सबसे ऊपर कॉल करें ---
  const { isAdmin, checking } = useAdminAuth(); // एडमिन चेक के लिए
  const { data: products } = useAdminData('products'); // प्रोडक्ट्स की गिनती के लिए
  const { data: orders } = useAdminData('orders'); // ऑर्डर्स की गिनती के लिए

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

  // अगर चेक चल रहा है या यूजर एडमिन नहीं है, तो कुछ न दिखाएं (हुक खुद हैंडल करेगा)
  if (checking) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- STEP 3: टॉप स्टैटिस्टिक्स कार्ड्स (नया हिस्सा) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-3 bg-stone-100 rounded-lg text-stone-600"><LayoutDashboard size={24} /></div>
            <div>
              <p className="text-sm text-stone-500 uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-bold">{products.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-3 bg-stone-100 rounded-lg text-stone-600"><ShoppingCart size={24} /></div>
            <div>
              <p className="text-sm text-stone-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-bold">{orders.length}</h3>
            </div>
          </div>
        </div>

        {/* प्रोडक्ट फॉर्म (आपका ओरिजिनल डिजाइन) */}
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-stone-100">
          <h1 className="text-3xl font-serif text-stone-900 mb-8 flex items-center gap-3">
            <PlusCircle className="text-stone-400" /> Add New Product
          </h1>

          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Tag className="absolute left-3 top-3 text-stone-400" size={18} />
                <input type="text" placeholder="Product Name" required className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-stone-900" 
                  value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-stone-400" size={18} />
                <input type="number" placeholder="Price" required className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-stone-900" 
                  value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} />
              </div>

              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 text-stone-400" size={18} />
                <input type="text" placeholder="Image URL (Direct link)" required className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-stone-900" 
                  value={product.image} onChange={(e) => setProduct({...product, image: e.target.value})} />
              </div>

              <textarea placeholder="Product Description" rows={4} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-stone-900" 
                value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white font-bold py-4 rounded-lg uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors">
              {loading ? <Loader2 className="animate-spin" /> : "Publish Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
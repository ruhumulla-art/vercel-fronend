import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, Image as ImageIcon, ShoppingCart, Clock, CheckCircle, Upload, Video } from 'lucide-react';

import { useAdminAuth } from '../Hook/useAdminAuth'; 
import { useAdminData } from '../Hook/useAdminData';

const Admin = () => {
  const { isAdmin, checking } = useAdminAuth(); 
  const { data: products } = useAdminData('products'); 
  const { data: orders } = useAdminData('orders'); 

  const [loading, setLoading] = useState(false);
  const [base64Image, setBase64Image] = useState<string>(""); // फोटो को स्टोर करने के लिए
  const [product, setProduct] = useState({ 
    name: '', price: '', description: '', category: 'Handbags', videoUrl: '' 
  });

  // --- कंप्यूटर से फोटो चुनकर उसे टेक्स्ट (Base64) में बदलने का फंक्शन ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string); // फोटो अब एक टेक्स्ट बन गई है
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Image) return alert("कृपया पहले एक फोटो चुनें!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...product,
        image: base64Image, // सीधे डेटाबेस में फोटो सेव हो रही है
        price: Number(product.price),
        createdAt: serverTimestamp()
      });
      alert("Product successfully added to Boutique!");
      setProduct({ name: '', price: '', description: '', category: 'Handbags', videoUrl: '' });
      setBase64Image(""); // फॉर्म रिसेट
    } catch (err) {
      alert("Error adding product.");
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending' ? 'Shipped' : (currentStatus === 'Shipped' ? 'Delivered' : 'Pending');
    try {
      await updateDoc(doc(db, "orders", orderId), { orderStatus: nextStatus });
    } catch (err) { alert("Status update failed"); }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-stone-900 mb-10 italic">Atelier Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* लेफ्ट: फोटो अपलोडर और फॉर्म */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 sticky top-10">
              <h2 className="text-lg font-serif mb-6 flex items-center gap-2"><Upload size={18}/> New Item</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="Bag Name" className="w-full p-3 bg-stone-50 rounded-xl text-sm outline-none" value={product.name} onChange={(e)=>setProduct({...product, name:e.target.value})} required />
                <input type="number" placeholder="Price" className="w-full p-3 bg-stone-50 rounded-xl text-sm outline-none" value={product.price} onChange={(e)=>setProduct({...product, price:e.target.value})} required />
                
                {/* फोटो सिलेक्शन एरिया - यहाँ URL की ज़रूरत नहीं है */}
                <div className="border-2 border-dashed border-stone-100 p-4 rounded-xl text-center hover:bg-stone-50 transition-all">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="internalUpload" />
                  <label htmlFor="internalUpload" className="cursor-pointer flex flex-col items-center gap-2 text-stone-400">
                    {base64Image ? (
                      <img src={base64Image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <>
                        <ImageIcon size={24} />
                        <span className="text-[10px] font-bold">SELECT FROM COMPUTER</span>
                      </>
                    )}
                  </label>
                </div>

                <textarea placeholder="Description" rows={3} className="w-full p-3 bg-stone-50 rounded-xl text-sm outline-none" value={product.description} onChange={(e)=>setProduct({...product, description:e.target.value})} />
                
                <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                  {loading ? "Adding..." : "Add to Boutique"}
                </button>
              </form>
            </div>
          </div>

          {/* राइट: ऑर्डर्स लिस्ट */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 min-h-[400px]">
              <h2 className="text-lg font-serif mb-6 flex items-center gap-2"><ShoppingCart size={18}/> Orders ({orders.length})</h2>
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl mb-3 border border-stone-100">
                  <div>
                    <p className="text-sm font-semibold">{order.customerId || 'Guest'}</p>
                    <p className="text-[9px] uppercase font-bold text-stone-400">{order.orderStatus || 'Pending'}</p>
                  </div>
                  <button onClick={() => handleStatusUpdate(order.id, order.orderStatus || 'Pending')} className="p-2 text-stone-300 hover:text-stone-900 transition-all">
                    <CheckCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
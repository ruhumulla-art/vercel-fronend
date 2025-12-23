import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, PlusCircle, Image as ImageIcon, Tag, DollarSign } from 'lucide-react';

const Admin = () => {
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

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
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

          <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white font-bold py-4 rounded-lg uppercase tracking-widest flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Publish Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
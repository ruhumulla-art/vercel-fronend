import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore(); // आपके कार्ट सिस्टम के लिए

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 'products' कलेक्शन से डेटा लाएं, नए प्रोडक्ट्स सबसे पहले दिखेंगे
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-stone-400" size={32} />
    </div>
  );

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-stone-900 mb-4 tracking-tight">The Collection</h1>
          <p className="text-stone-500 font-light italic">Timeless luxury, handcrafted for you.</p>
        </header>

        {products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            No products found. Please add some from the Admin Panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-stone-900 hover:text-white"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-stone-900 font-medium tracking-wide uppercase text-sm">{product.name}</h3>
                    <p className="text-stone-400 text-xs mt-1 uppercase tracking-widest">{product.category}</p>
                  </div>
                  <span className="text-stone-900 font-serif">₹{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
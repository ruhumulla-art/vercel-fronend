import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, FileText, 
  Image as ImageIcon, Plus, Search, Edit, Trash2, X, 
  Save, Globe, UploadCloud, TrendingUp, CheckCircle
} from 'lucide-react';
import { useAdminAuth } from '../Hook/useAdminAuth'; 

const Admin = () => {
  const { isAdmin, checking } = useAdminAuth(); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Product Form State (Based on your Catalog.tsx)
  const [base64Image, setBase64Image] = useState<string>("");
  const [productForm, setProductForm] = useState({ 
    name: '', sku: '', price: '', stock: '10', category: 'Handbags', 
    description: '', metaTitle: '', status: 'Active' 
  });

  // --- Real-time Firebase Sync ---
  useEffect(() => {
    if (!isAdmin) return;
    const unsubP = onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => 
      setProducts(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubO = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => 
      setOrders(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubP(); unsubO(); };
  }, [isAdmin]);

  // --- Functions ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Image) return alert("Please select an image!");
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...productForm,
        image: base64Image, // Integrated Base64 support
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        createdAt: serverTimestamp()
      });
      alert("Product successfully added to Catalog!");
      setProductForm({ name: '', sku: '', price: '', stock: '10', category: 'Handbags', description: '', metaTitle: '', status: 'Active' });
      setBase64Image("");
    } catch (err) { alert("Error adding product."); } finally { setLoading(false); }
  };

  if (checking) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#eb5202]" /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex font-sans">
      {/* --- SIDEBAR (Matching your Content.tsx logic) --- */}
      <aside className="w-64 bg-[#333] text-white flex flex-col p-6 shadow-xl">
        <div className="mb-10 pb-6 border-b border-gray-700">
          <h1 className="text-2xl font-light tracking-widest uppercase">Lora Halle</h1>
          <p className="text-[10px] text-gray-500 uppercase mt-1">Admin Engine</p>
        </div>
        
        <nav className="flex-grow space-y-2">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
            { id: 'catalog', icon: <Package size={18}/>, label: 'Catalog' },
            { id: 'orders', icon: <ShoppingCart size={18}/>, label: 'Orders' },
            { id: 'content', icon: <FileText size={18}/>, label: 'Content' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${activeTab === item.id ? 'bg-[#eb5202] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-light text-[#333] capitalize">{activeTab} Management</h2>
          <div className="flex gap-4">
             <div className="text-right mr-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p><p className="text-xs font-bold text-green-600">LIVE SYNC</p></div>
          </div>
        </header>

        {/* 1. Dashboard View (Integrated from Dashboard.tsx) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-4 gap-6">
              <KPICard title="Revenue" value={`₹${products.length * 4999}+`} icon={<TrendingUp className="text-green-500"/>} />
              <KPICard title="Total Orders" value={orders.length} icon={<ShoppingCart className="text-blue-500"/>} />
              <KPICard title="Live SKUs" value={products.length} icon={<Package className="text-orange-500"/>} />
              <KPICard title="Customers" value="24" icon={<Users className="text-purple-500"/>} />
            </div>

            {/* Quick Add Form (From Catalog.tsx logic) */}
            <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2"><Plus size={18} className="text-[#eb5202]"/> New Catalog Entry</h3>
              <form onSubmit={handlePublish} className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <input type="text" placeholder="Product Name" className="w-full border p-3 text-sm focus:border-[#eb5202] outline-none" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} required />
                   <div className="flex gap-4">
                     <input type="text" placeholder="SKU Code" className="w-full border p-3 text-sm outline-none" value={productForm.sku} onChange={e=>setProductForm({...productForm, sku: e.target.value})} required />
                     <input type="number" placeholder="Price" className="w-full border p-3 text-sm outline-none font-bold" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} required />
                   </div>
                   <textarea placeholder="Product SEO Description" rows={4} className="w-full border p-3 text-sm outline-none" value={productForm.description} onChange={e=>setProductForm({...productForm, description: e.target.value})} />
                </div>
                
                <div className="border-2 border-dashed border-gray-200 rounded-sm p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-[#fff4e5] transition-all cursor-pointer relative">
                   <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                   {base64Image ? <img src={base64Image} className="h-48 rounded-sm shadow-md" /> : (
                     <>
                      <UploadCloud size={40} className="text-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upload Master Media</p>
                      <p className="text-[10px] text-gray-400 mt-1">Direct Local Import Enabled</p>
                     </>
                   )}
                </div>
                <button type="submit" disabled={loading} className="col-span-2 bg-[#eb5202] text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-[#d44900] shadow-lg">
                  {loading ? "Publishing to Global Store..." : "Publish Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. Catalog View (Integrated from Catalog.tsx) */}
        {activeTab === 'catalog' && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <div className="relative w-72"><input type="text" placeholder="Search SKU or Name..." className="w-full pl-10 pr-4 py-2 border rounded-sm text-sm" /><Search size={16} className="absolute left-3 top-2.5 text-gray-400" /></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">{products.length} Products Active</p>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <tr><th className="p-4">Media</th><th className="p-4">Product Details</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 group">
                    <td className="p-4"><img src={p.image} className="w-12 h-12 object-cover rounded shadow-sm" /></td>
                    <td className="p-4"><p className="font-bold text-gray-800">{p.name}</p><p className="text-[10px] text-gray-400 uppercase">{p.sku}</p></td>
                    <td className="p-4 font-bold text-[#eb5202]">₹{p.price}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-sm text-[10px] font-bold ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>QTY: {p.stock}</span></td>
                    <td className="p-4 text-right"><button onClick={() => deleteDoc(doc(db, "products", p.id))} className="text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Orders View (Integrated from Orders.tsx) */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#333] text-white text-[10px] font-bold uppercase tracking-widest">
                <tr><th className="p-5">Order ID</th><th className="p-5">Customer</th><th className="p-5">Status</th><th className="p-5 text-right">Update</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-orange-50/30 transition-all">
                    <td className="p-5 font-mono text-xs text-gray-400">#{o.id.slice(0,8).toUpperCase()}</td>
                    <td className="p-5 font-bold text-gray-700">{o.customerId || 'Guest Client'}</td>
                    <td className="p-5"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-[#fff4e5] text-[#eb5202]'}`}>{o.orderStatus || 'Pending'}</span></td>
                    <td className="p-5 text-right"><button onClick={() => updateDoc(doc(db, "orders", o.id), { orderStatus: o.orderStatus === 'Pending' ? 'Shipped' : 'Delivered' })} className="text-[#eb5202] hover:scale-110 transition-all"><CheckCircle size={20} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

const KPICard = ({ title, value, icon }: any) => (
  <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-[#333]">{value}</h3>
  </div>
);

export default Admin;
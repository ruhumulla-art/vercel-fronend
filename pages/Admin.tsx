import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  Loader2, PlusCircle, Image as ImageIcon, ShoppingCart, 
  CheckCircle, Upload, LayoutDashboard, Package, 
  TrendingUp, Trash2, LogOut, Settings, Bell, DollarSign,
  Users, CreditCard, Activity, Search, Filter, Download
} from 'lucide-react';
import { useAdminAuth } from '../Hook/useAdminAuth'; 

const Admin = () => {
  const { isAdmin, checking } = useAdminAuth(); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [base64Image, setBase64Image] = useState<string>("");
  const [product, setProduct] = useState({ 
    name: '', price: '', description: '', category: 'Handbags', stock: '10', sku: 'LH-' + Math.floor(Math.random() * 9000) 
  });

  useEffect(() => {
    if (!isAdmin) return;
    const unsubP = onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => 
      setProducts(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubO = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => 
      setOrders(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubP(); unsubO(); };
  }, [isAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Image) return alert("Please select an image first!");
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        ...product, image: base64Image, price: Number(product.price),
        stock: Number(product.stock), createdAt: serverTimestamp()
      });
      alert("Bag Published to Boutique!");
      setProduct({ name: '', price: '', description: '', category: 'Handbags', stock: '10', sku: 'LH-' + Math.floor(Math.random() * 9000) });
      setBase64Image("");
    } catch (err) { alert("Execution Failed!"); } finally { setLoading(false); }
  };

  if (checking) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-stone-300" size={40} /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex font-sans text-stone-900">
      {/* --- Sidebar (Elite Dark Design) --- */}
      <aside className="w-80 bg-stone-950 text-white flex flex-col p-8 space-y-12 shadow-2xl z-50">
        <div className="flex flex-col gap-2 border-b border-stone-800 pb-8">
          <span className="text-[10px] font-bold tracking-[0.5em] text-stone-500 uppercase">Administrator</span>
          <h1 className="text-3xl font-serif italic font-light">Atelier OS</h1>
        </div>

        <nav className="flex-grow space-y-4">
          {[
            { id: 'dashboard', icon: <Activity size={20}/>, label: 'Analytics Hub' },
            { id: 'inventory', icon: <Package size={20}/>, label: 'Boutique Inventory' },
            { id: 'orders', icon: <CreditCard size={20}/>, label: 'Transactions' },
            { id: 'customers', icon: <Users size={20}/>, label: 'Private Clients' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-[24px] text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === item.id ? 'bg-white text-stone-900 shadow-2xl scale-105' : 'text-stone-500 hover:text-white hover:bg-stone-900'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="bg-stone-900/50 p-6 rounded-[32px] border border-stone-800">
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-4">Storage Used</p>
          <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/4 rounded-full"></div>
          </div>
          <p className="text-[9px] mt-3 text-stone-400">75% Capacity (Spark Plan)</p>
        </div>
      </aside>

      {/* --- Main Dashboard Body --- */}
      <main className="flex-grow p-14 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Workspace Overview</p>
            <h2 className="text-5xl font-serif text-stone-900 tracking-tight capitalize">{activeTab}</h2>
          </div>
          <div className="flex gap-4">
            <button className="bg-white p-4 rounded-full border border-stone-100 shadow-sm text-stone-400 hover:text-stone-900"><Bell size={20}/></button>
            <button className="bg-stone-900 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">System Update</button>
          </div>
        </header>

        {/* Dashboard View (Analytics & Quick Actions) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm relative overflow-hidden group">
                <DollarSign className="absolute -right-4 -top-4 text-stone-50/50" size={120} />
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">Total Sales Value</p>
                <h3 className="text-4xl font-serif mt-3 italic tracking-tighter">₹{products.length * 4999}+</h3>
                <div className="mt-6 flex items-center gap-2 text-green-500 text-[10px] font-bold">
                  <TrendingUp size={14}/> +12.5% GROWTH
                </div>
              </div>
              <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm">
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">Active Inventory</p>
                <h3 className="text-4xl font-serif mt-3">{products.length} <span className="text-sm italic">SKUs</span></h3>
                <p className="mt-6 text-[10px] font-bold text-stone-300">STABLE STOCK LEVELS</p>
              </div>
              <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm">
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">Unprocessed Orders</p>
                <h3 className="text-4xl font-serif mt-3">{orders.filter(o => o.orderStatus === 'Pending').length}</h3>
                <p className="mt-6 text-[10px] font-bold text-amber-500 uppercase">Action Required</p>
              </div>
            </div>

            {/* Elite Quick Publish Form */}
            <div className="bg-white p-12 rounded-[56px] shadow-2xl shadow-stone-200/40 border border-stone-50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-serif italic tracking-tight">Rapid Product Deployment</h3>
                <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">Automated Indexing</span>
              </div>
              <form onSubmit={handleAddProduct} className="grid grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Product Identity</label>
                  <input type="text" placeholder="e.g. Midnight Suede Clutch" className="w-full p-5 bg-stone-50 rounded-[24px] outline-none border border-transparent focus:border-stone-200" value={product.name} onChange={e=>setProduct({...product, name:e.target.value})} required />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Valuation (INR)</label>
                  <input type="number" placeholder="4999" className="w-full p-5 bg-stone-50 rounded-[24px] outline-none border border-transparent focus:border-stone-200" value={product.price} onChange={e=>setProduct({...product, price:e.target.value})} required />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Stock Allocation</label>
                  <input type="number" placeholder="10" className="w-full p-5 bg-stone-50 rounded-[24px] outline-none border border-transparent focus:border-stone-200" value={product.stock} onChange={e=>setProduct({...product, stock:e.target.value})} required />
                </div>
                
                <div className="col-span-3 border-2 border-dashed border-stone-100 p-14 rounded-[40px] text-center hover:bg-stone-50/50 transition-all cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="megaIn" />
                  <label htmlFor="megaIn" className="cursor-pointer flex flex-col items-center gap-6">
                    {base64Image ? (
                      <div className="relative">
                        <img src={base64Image} className="h-56 rounded-[32px] shadow-2xl border-8 border-white group-hover:scale-105 transition-transform" />
                        <div className="absolute -top-4 -right-4 bg-black text-white p-3 rounded-full shadow-xl"><CheckCircle size={20}/></div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 group-hover:text-stone-900 transition-colors"><ImageIcon size={40}/></div>
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400">Upload High-Res Boutique Media</span>
                  </label>
                </div>
                <button type="submit" disabled={loading} className="col-span-3 bg-stone-900 text-white py-7 rounded-[32px] text-[12px] font-bold uppercase tracking-[0.5em] shadow-2xl hover:bg-black transition-all">
                  {loading ? "Synchronizing with Server..." : "Execute Product Launch"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Inventory Table View */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-[48px] border border-stone-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
              <div className="flex gap-4"><button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white px-6 py-3 rounded-full border border-stone-100"><Filter size={14}/> Sort</button></div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{products.length} Items Indexed</p>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100">
                  <th className="p-8">Visual</th>
                  <th className="p-8">Details</th>
                  <th className="p-8">Valuation</th>
                  <th className="p-8">Inventory Status</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/30 transition-all group">
                    <td className="p-8"><img src={p.image} className="w-20 h-20 object-cover rounded-2xl shadow-sm group-hover:scale-110 transition-transform" /></td>
                    <td className="p-8"><h4 className="font-serif text-lg">{p.name}</h4><p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">SKU: {p.sku || 'N/A'}</p></td>
                    <td className="p-8 font-bold text-stone-900">₹{p.price}</td>
                    <td className="p-8"><span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${p.stock > 5 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{p.stock} units left</span></td>
                    <td className="p-8 text-right"><button onClick={() => deleteDoc(doc(db, "products", p.id))} className="p-4 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction History (Orders) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-[48px] border border-stone-100 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-stone-50 flex justify-between items-center bg-stone-900 text-white">
              <h3 className="text-xl font-serif italic">Ledger & Logistics</h3>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-stone-800 px-6 py-3 rounded-full hover:bg-stone-700 transition-all"><Download size={14}/> Export Manifest</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 bg-stone-50/50">
                  <th className="p-8">Reference</th>
                  <th className="p-8">Client</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Update Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-stone-50/20 transition-all">
                    <td className="p-8 font-mono text-[10px] text-stone-400">TRX-{o.id.slice(0,8).toUpperCase()}</td>
                    <td className="p-8 font-serif text-lg text-stone-800">{o.customerId || 'Private Guest'}</td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${o.orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{o.orderStatus || 'Processing'}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => updateDoc(doc(db, "orders", o.id), { orderStatus: o.orderStatus === 'Pending' ? 'Shipped' : 'Delivered' })} 
                        className="bg-stone-50 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-white transition-all border border-stone-100">
                        Promote Stage
                      </button>
                    </td>
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

export default Admin;
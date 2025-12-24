import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, FolderOpen, Grid, Megaphone, 
  FileText, Store, RotateCcw, Settings, UploadCloud, BarChart3, ShieldCheck, 
  LogOut, Search, Bell, Plus, Download, X, Edit, Trash2, CheckCircle2, 
  ChevronDown, Palette, Image as ImageIcon, Link as LinkIcon, ExternalLink, 
  Clock, Package, Truck, CreditCard, Save, Loader2, FileSpreadsheet, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// ==========================================
// 1. MASTER BACKEND HOOK (Connects to Vercel/Firebase)
// ==========================================
const useMasterAtelier = () => {
  const [loading, setLoading] = useState(false);
  const BASE_URL = "/api/master";

  const call = async (col: string, method: string = 'GET', body: any = null, id: string = '') => {
    setLoading(true);
    try {
      const url = `${BASE_URL}?col=${col}${id ? `&id=${id}` : ''}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
      });
      return await res.json();
    } catch (e) { console.error("API Error:", e); return { error: true }; }
    finally { setLoading(false); }
  };

  return {
    list: (col: string) => call(col, 'GET'),
    add: (col: string, data: any) => call(col, 'POST', data),
    update: (col: string, id: string, data: any) => call(col, 'PUT', data, id),
    remove: (col: string, id: string) => call(col, 'DELETE', null, id),
    bulk: (data: any[]) => call('bulk', 'POST', { items: data }),
    loading
  };
};

// ==========================================
// 2. MAIN ADMIN CONTROLLER
// ==========================================
export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const api = useMasterAtelier();
  const [globalData, setGlobalData] = useState<any[]>([]);

  // Auto-fetch data based on tab
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.list(activeTab);
      if (Array.isArray(res)) setGlobalData(res);
    };
    if (['catalog', 'orders', 'customers', 'reports', 'inventory', 'marketing'].includes(activeTab)) {
      fetchData();
    }
  }, [activeTab]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'catalog', label: 'Catalog / Products', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'content', label: 'Content (CMS)', icon: FileText },
    { id: 'files', label: 'Media Library', icon: FolderOpen },
    { id: 'inventory', label: 'Sources (Stores)', icon: Store },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'import', label: 'Bulk Import', icon: UploadCloud },
    { id: 'reports', label: 'Audit Logs', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-gray-800 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#2D2D2D] text-gray-400 fixed h-full z-20 shadow-2xl overflow-y-auto">
        <div className="p-6 bg-[#EB5202] text-white font-bold text-xl flex items-center gap-2 sticky top-0 z-30">
          <div className="bg-white text-[#EB5202] px-2 rounded font-black">G</div> GenAlpha Pro
        </div>
        <nav className="mt-4 pb-20">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-[13px] font-medium transition-all 
              ${activeTab === item.id ? 'bg-[#3D3D3D] text-white border-l-4 border-[#EB5202]' : 'hover:bg-[#353535] hover:text-white'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 bg-[#2D2D2D] border-t border-[#3D3D3D]">
          <button className="flex items-center gap-3 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest" onClick={() => {localStorage.clear(); window.location.reload();}}>
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="ml-64 flex-grow flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center bg-[#F9F9F9] border rounded-md px-3 py-1.5 w-96">
            <Search size={16} className="text-gray-400 mr-2"/>
            <input type="text" placeholder="Global Search Across Backend..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative"><Bell size={20} className="text-gray-500 cursor-pointer"/><span className="absolute -top-1 -right-1 bg-[#EB5202] text-white text-[9px] px-1 rounded-full animate-pulse">5</span></div>
            <div className="flex items-center gap-3">
               <div className="text-right"><p className="text-xs font-bold text-gray-800">Master Admin</p><p className="text-[10px] text-green-500 font-bold uppercase">Online</p></div>
               <div className="w-10 h-10 bg-[#EB5202] rounded-full text-white flex items-center justify-center font-black shadow-lg border-2 border-white">A</div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'orders' && <OrdersSection data={globalData} api={api} />}
          {activeTab === 'catalog' && <CatalogSection data={globalData} api={api} />}
          {activeTab === 'customers' && <CustomersSection data={globalData} />}
          {activeTab === 'content' && <ContentSection />}
          {activeTab === 'files' && <FilesSection />}
          {activeTab === 'inventory' && <InventorySection data={globalData} api={api} />}
          {activeTab === 'marketing' && <MarketingSection data={globalData} api={api} />}
          {activeTab === 'import' && <BulkImportSection api={api} />}
          {activeTab === 'reports' && <ReportsSection data={globalData} />}
          {activeTab === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 3. TAB SECTIONS (SABHI WORKING CODE)
// ==========================================

// --- DASHBOARD SECTION ---
function DashboardSection() {
  const chartData = [
    { date: '2024-01', revenue: 45000, orders: 120 },
    { date: '2024-02', revenue: 52000, orders: 150 },
    { date: '2024-03', revenue: 48000, orders: 140 },
    { date: '2024-04', revenue: 70000, orders: 210 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Net Revenue" value="₹12,45,000" trend="+14%" icon={<CreditCard size={20}/>} />
        <KPICard title="Total Orders" value="8,420" trend="+8%" icon={<ShoppingCart size={20}/>} />
        <KPICard title="Customers" value="3,150" trend="+22%" icon={<Users size={20}/>} />
        <KPICard title="Conv. Rate" value="3.42%" trend="-2%" icon={<BarChart3 size={20}/>} />
      </div>
      <div className="bg-white p-6 border rounded-sm shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-gray-700 uppercase tracking-tighter">Sales Analytics Trend</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip contentStyle={{borderRadius: '0px', border: '1px solid #eb5202'}} />
              <Area type="monotone" dataKey="revenue" stroke="#EB5202" fill="#eb520220" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const KPICard = ({ title, value, trend, icon }: any) => (
  <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 text-gray-100 group-hover:text-orange-50 transition-colors">{icon}</div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    <h2 className="text-2xl font-black text-gray-800 mt-1">{value}</h2>
    <p className={`text-[10px] font-bold mt-2 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend} from last month</p>
  </div>
);

// --- CATALOG SECTION (ADVANCED) ---
function CatalogSection({ data, api }: any) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ name: '', sku: '', price: 0, stock: 0, category: 'Bags' });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light">Product Catalog</h2>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-sm text-xs font-bold uppercase"><Download size={14} className="inline mr-2"/> Export</button>
          <button onClick={() => setShowModal(true)} className="bg-[#EB5202] text-white px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-black transition-all shadow-lg">
            <Plus size={16}/> Add New Product
          </button>
        </div>
      </div>
      <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-[11px] font-bold text-gray-500 uppercase">
            <tr><th className="p-4">Img</th><th className="p-4">Product Name / SKU</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4 text-center">Stock</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((p: any) => (
              <tr key={p.id} className="hover:bg-orange-50/30">
                <td className="p-4 w-16"><div className="w-10 h-10 bg-gray-100 border rounded flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div></td>
                <td className="p-4"><p className="font-bold text-gray-800">{p.name}</p><p className="text-[10px] text-gray-400 uppercase font-mono">{p.sku}</p></td>
                <td className="p-4 text-xs text-gray-500 italic">{p.category}</td>
                <td className="p-4 font-black text-[#EB5202]">₹{p.price}</td>
                <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{p.stock} Units</span></td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-blue-600 mr-4"><Edit size={16}/></button>
                  <button onClick={() => api.remove('catalog', p.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-sm w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95">
            <div className="flex justify-between mb-6 border-b pb-2"><h3 className="font-bold text-gray-700 uppercase tracking-widest text-sm">Product Entry</h3><X size={20} className="cursor-pointer" onClick={()=>setShowModal(false)}/></div>
            <div className="space-y-4">
               <div><label className="text-[10px] font-bold text-gray-400 uppercase">Product Name</label><input className="w-full border p-2 mt-1 outline-none focus:border-[#eb5202]" onChange={e=>setForm({...form, name: e.target.value})}/></div>
               <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Base SKU</label><input className="w-full border p-2 mt-1" onChange={e=>setForm({...form, sku: e.target.value})}/></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Price (₹)</label><input type="number" className="w-full border p-2 mt-1" onChange={e=>setForm({...form, price: Number(e.target.value)})}/></div>
               </div>
               <button onClick={async ()=>{await api.add('catalog', form); setShowModal(false);}} className="w-full bg-[#EB5202] text-white py-3 font-black uppercase text-xs tracking-widest mt-4 shadow-lg hover:bg-black transition-all">Save to Firebase</button>
            </div>
          </div>
      </div>}
    </div>
  );
}

// --- ORDERS SECTION ---
function OrdersSection({ data, api }: any) {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-light">Order Management</h2><button className="bg-[#2D2D2D] text-white px-4 py-2 text-xs font-bold uppercase">+ Manual Order</button></div>
       <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <tr><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">View</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((o: any) => (
              <tr key={o.id} className="hover:bg-gray-50 group">
                <td className="p-4 font-bold text-[#EB5202] font-mono">{o.id}</td>
                <td className="p-4 text-xs text-gray-400">{new Date().toLocaleDateString()}</td>
                <td className="p-4 text-gray-700">{o.customerName}</td>
                <td className="p-4 font-black">₹{o.totalAmount}</td>
                <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${o.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{o.status}</span></td>
                <td className="p-4 text-right"><button className="bg-white border px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-800 hover:text-white transition-all">Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- CUSTOMERS SECTION ---
function CustomersSection({ data }: any) {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-light">Customers Database</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((c: any) => (
            <div key={c.id} className="bg-white p-6 border rounded-sm shadow-sm flex flex-col items-center text-center group hover:border-[#eb5202] transition-colors">
               <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-xl font-black text-[#eb5202] group-hover:bg-orange-50 transition-colors uppercase">{c.displayName?.charAt(0)}</div>
               <h4 className="font-bold text-gray-800">{c.displayName}</h4>
               <p className="text-xs text-gray-400 mb-4">{c.email}</p>
               <div className="w-full pt-4 border-t flex justify-around text-[10px] font-bold uppercase text-gray-500">
                  <div>Orders: <span className="text-gray-800">{c.stats?.orderCount || 0}</span></div>
                  <div>Spend: <span className="text-[#eb5202]">₹{c.stats?.totalSpent || 0}</span></div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}

// --- CONTENT SECTION (CMS) ---
function ContentSection() {
  const [tab, setTab] = useState('pages');
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-light border-b pb-4">Content Management System</h2>
       <div className="flex gap-4">
          {['pages', 'blog', 'menus'].map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border ${tab === t ? 'bg-[#eb5202] text-white border-[#eb5202]' : 'bg-white text-gray-500'}`}>{t}</button>
          ))}
       </div>
       <div className="bg-white border rounded-sm min-h-[400px] flex flex-col items-center justify-center p-10 text-center">
          <FileText size={48} className="text-gray-100 mb-4" />
          <h3 className="font-bold text-gray-800 uppercase tracking-tighter">Ready to Edit {tab}</h3>
          <p className="text-xs text-gray-400 max-w-xs mt-2">Manage your storefront's {tab} data. All changes sync directly to Firebase Hosting.</p>
          <button className="mt-6 bg-[#2D2D2D] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-xl">+ Create New {tab.slice(0, -1)}</button>
       </div>
    </div>
  );
}

// --- FILES SECTION (MEDIA) ---
function FilesSection() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-light">Media Library</h2><button className="bg-[#EB5202] text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-2"><UploadCloud size={16}/> Upload File</button></div>
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-white border border-gray-200 rounded-sm overflow-hidden group relative shadow-sm">
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-200"><ImageIcon size={32}/> <p className="text-[8px] font-bold mt-2">IMG_{i}024.JPG</p></div>
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="p-2 bg-white rounded-full text-blue-600 shadow-lg"><LinkIcon size={14}/></button>
                  <button className="p-2 bg-white rounded-full text-red-600 shadow-lg"><Trash2 size={14}/></button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}

// --- INVENTORY SECTION (SOURCES) ---
function InventorySection({ data, api }: any) {
  return (
    <div className="space-y-4">
       <h2 className="text-2xl font-light">Inventory Sources (Warehouses)</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-l-4 border-l-[#eb5202] p-6 shadow-sm rounded-sm">
             <div className="flex justify-between items-start mb-4"><h4 className="font-bold text-gray-800">Main Warehouse</h4><span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded">PRIMARY</span></div>
             <p className="text-xs text-gray-500 mb-6 flex items-center gap-2"><MapPin size={12}/> Mumbai, Maharashtra - 400001</p>
             <div className="flex justify-between text-xs font-bold uppercase text-gray-400"><span>Stock Capacity</span><span className="text-gray-800">85% Full</span></div>
             <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-[#eb5202] h-full w-[85%]"></div></div>
          </div>
          <div className="bg-white border-l-4 border-l-gray-300 p-6 shadow-sm rounded-sm">
             <div className="flex justify-between items-start mb-4"><h4 className="font-bold text-gray-800">Secondary Hub</h4><span className="bg-gray-100 text-gray-600 text-[8px] font-black px-2 py-0.5 rounded">BACKUP</span></div>
             <p className="text-xs text-gray-500 mb-6 flex items-center gap-2"><MapPin size={12}/> Delhi, NCR - 110001</p>
             <div className="flex justify-between text-xs font-bold uppercase text-gray-400"><span>Stock Capacity</span><span className="text-gray-800">20% Full</span></div>
             <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-blue-400 h-full w-[20%]"></div></div>
          </div>
          <button className="border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-gray-400 hover:border-[#eb5202] hover:text-[#eb5202] transition-all"><Plus size={24}/><span className="text-[10px] font-bold uppercase mt-2">Add New Location</span></button>
       </div>
    </div>
  );
}

// --- MARKETING SECTION ---
function MarketingSection({ data, api }: any) {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-light">Marketing & Promotions</h2><button className="bg-[#EB5202] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-lg">+ Create Campaign</button></div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border rounded-sm p-6 shadow-sm">
             <h3 className="font-bold text-sm text-gray-700 uppercase mb-4 border-b pb-2">Active Coupon Codes</h3>
             <div className="space-y-3">
                {['SUMMER10', 'WELCOME20', 'GENALPHA'].map(c => (
                  <div key={c} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-sm">
                     <span className="font-mono font-black text-[#eb5202]">{c}</span>
                     <div className="flex items-center gap-4 text-xs font-bold uppercase text-gray-400"><span>240 Uses</span><button className="text-red-500"><Trash2 size={14}/></button></div>
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-[#2D2D2D] text-white rounded-sm p-6 shadow-xl relative overflow-hidden">
             <Megaphone className="absolute -bottom-4 -right-4 opacity-10" size={120} />
             <h3 className="font-bold text-sm uppercase mb-4 border-b border-gray-600 pb-2 tracking-widest">Active Campaigns</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center"><p className="text-sm font-bold">Email Blast - New Collection</p><span className="text-[10px] bg-green-500 px-2 py-0.5 rounded font-black">RUNNING</span></div>
                <p className="text-xs text-gray-400">Sent to 4,500 subscribers. Click rate: 12%</p>
                <div className="w-full bg-gray-700 h-1 rounded-full"><div className="bg-[#eb5202] h-full w-[45%]"></div></div>
             </div>
          </div>
       </div>
    </div>
  );
}

// --- BULK IMPORT SECTION ---
function BulkImportSection({ api }: any) {
  return (
    <div className="space-y-8 bg-white p-10 border border-gray-200 rounded-sm shadow-sm text-center">
       <div className="w-20 h-20 bg-orange-50 text-[#eb5202] rounded-full flex items-center justify-center mx-auto mb-6"><FileSpreadsheet size={40}/></div>
       <div>
          <h2 className="text-3xl font-light text-gray-800">Master Data Import</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">Upload CSV or JSON files to bulk update your entire catalog, customer list, or inventory stocks in one click.</p>
       </div>
       <div className="flex items-center justify-center gap-4 mt-8">
          <button className="bg-gray-100 text-gray-600 px-10 py-3 text-xs font-bold uppercase tracking-widest border border-gray-300 hover:bg-white transition-all shadow-sm">Download Template</button>
          <label className="bg-[#EB5202] text-white px-10 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg hover:bg-black transition-all">
             Select Master File
             <input type="file" className="hidden" />
          </label>
       </div>
    </div>
  );
}

// --- REPORTS SECTION (AUDIT LOGS) ---
function ReportsSection({ data }: any) {
  return (
    <div className="space-y-4">
       <h2 className="text-2xl font-light">System Audit History</h2>
       <div className="bg-white border rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            <tr><th className="p-4">Timestamp</th><th className="p-4">Action Type</th><th className="p-4">Admin User</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[13px]">
            {data.map((l: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-gray-400">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="p-4 font-bold uppercase text-gray-800">{l.action}</td>
                <td className="p-4 flex items-center gap-2"><div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">AD</div> {l.user}</td>
                <td className="p-4"><span className="flex items-center gap-1 text-green-500 font-bold uppercase text-[10px]"><CheckCircle2 size={12}/> Success</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- SETTINGS SECTION ---
function SettingsSection() {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-light border-b pb-4">Global Backend Configuration</h2>
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
             <div className="bg-white p-8 border rounded-sm shadow-sm">
                <h3 className="font-bold text-gray-700 uppercase tracking-widest text-xs mb-6 border-b pb-2">Store Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div><label className="text-[10px] font-bold text-gray-400 uppercase">Store Frontend Name</label><input className="w-full border p-2.5 mt-1 focus:border-[#eb5202] outline-none" defaultValue="GenAlpha Official Store" /></div>
                   <div><label className="text-[10px] font-bold text-gray-400 uppercase">System Currency</label><select className="w-full border p-2.5 mt-1"><option>INR (₹) - Indian Rupee</option><option>USD ($) - US Dollar</option></select></div>
                   <div className="md:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Corporate HQ Address</label><textarea className="w-full border p-2.5 mt-1" rows={3} defaultValue="123 Fashion Tech Park, BKC, Mumbai - 400051"></textarea></div>
                </div>
             </div>
             <div className="bg-white p-8 border rounded-sm shadow-sm">
                <h3 className="font-bold text-gray-700 uppercase tracking-widest text-xs mb-6 border-b pb-2 text-blue-600">Payment & Logistics API</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-sm">
                      <div><p className="text-sm font-bold text-gray-800">Razorpay Integration</p><p className="text-[10px] text-gray-400">Live Production Mode Active</p></div>
                      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-sm">
                      <div><p className="text-sm font-bold text-gray-800">WhatsApp Notification API</p><p className="text-[10px] text-gray-400">Twilio / Cloud API</p></div>
                      <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                   </div>
                </div>
             </div>
          </div>
          <div className="space-y-6">
             <div className="bg-[#2D2D2D] p-6 text-white rounded-sm shadow-2xl relative overflow-hidden">
                <ShieldCheck className="absolute -bottom-2 -right-2 text-gray-800" size={100} />
                <h3 className="font-bold text-sm border-b border-gray-700 pb-3 mb-4 uppercase tracking-widest">Master Security</h3>
                <div className="space-y-4 text-xs">
                   <div className="flex justify-between"><span>Firebase Connection</span><span className="text-green-500 font-bold uppercase">Active</span></div>
                   <div className="flex justify-between"><span>Vercel Edge API</span><span className="text-green-500 font-bold uppercase">Encrypted</span></div>
                   <div className="flex justify-between"><span>Database Backups</span><span className="text-orange-500 font-bold uppercase">Scheduled</span></div>
                   <div className="flex justify-between"><span>Two-Factor Auth</span><span className="text-gray-500 font-bold uppercase">Disabled</span></div>
                </div>
                <button className="w-full mt-6 bg-white text-gray-800 py-2 font-bold uppercase text-[10px] hover:bg-[#EB5202] hover:text-white transition-all">Verify All Nodes</button>
             </div>
             <div className="bg-white p-6 border rounded-sm shadow-sm text-center">
                <div className="w-12 h-12 bg-orange-50 text-[#EB5202] rounded-full flex items-center justify-center mx-auto mb-4"><RotateCcw size={24}/></div>
                <h4 className="font-bold text-gray-800 text-sm">Clear System Cache</h4>
                <p className="text-[10px] text-gray-400 mt-1 mb-4 italic">Force refresh all master data collections from Firestore.</p>
                <button className="text-red-500 text-[10px] font-black border border-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">Execute Clear</button>
             </div>
          </div>
       </div>
       <div className="flex justify-end pt-10"><button className="bg-[#EB5202] text-white px-12 py-4 rounded-sm font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all">Publish Global Settings</button></div>
    </div>
  );
}

const MapPin = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
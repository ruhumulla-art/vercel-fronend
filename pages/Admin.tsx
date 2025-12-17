
import React from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, MOCK_ORDERS } from '../services/mockData';
import { BarChart, Users, DollarSign, Package } from 'lucide-react';

// Admin Panel
// Only basic UI for stats and management

const Admin = () => {
  const { user } = useStore();

  if (user?.role !== 'admin') {
    return (
        <div className="h-[60vh] flex items-center justify-center flex-col">
            <h1 className="text-4xl text-stone-300 font-serif mb-4">Restricted Access</h1>
            <p className="text-stone-500">This area is reserved for administrators.</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
      <h1 className="text-3xl font-serif text-stone-900 mb-10">Atelier Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 shadow-sm border border-stone-100">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-stone-50 text-stone-900"><DollarSign size={20} strokeWidth={1.5}/></div>
           </div>
           <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Revenue</p>
           <h3 className="text-2xl font-serif text-stone-900">₹84,500</h3>
        </div>
        <div className="bg-white p-6 shadow-sm border border-stone-100">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-stone-50 text-stone-900"><Users size={20} strokeWidth={1.5}/></div>
           </div>
           <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Clients</p>
           <h3 className="text-2xl font-serif text-stone-900">1,234</h3>
        </div>
        <div className="bg-white p-6 shadow-sm border border-stone-100">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-stone-50 text-stone-900"><Package size={20} strokeWidth={1.5}/></div>
           </div>
           <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Products</p>
           <h3 className="text-2xl font-serif text-stone-900">{PRODUCTS.length}</h3>
        </div>
        <div className="bg-white p-6 shadow-sm border border-stone-100">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-stone-50 text-stone-900"><BarChart size={20} strokeWidth={1.5}/></div>
           </div>
           <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Orders</p>
           <h3 className="text-2xl font-serif text-stone-900">12</h3>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-stone-100 shadow-sm">
        <div className="p-6 border-b border-stone-100">
           <h3 className="text-lg font-serif text-stone-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-stone-600">
            <thead className="bg-stone-50 text-xs uppercase tracking-widest font-bold text-stone-500">
              <tr>
                <th className="p-4 font-normal">Order Ref</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
               {MOCK_ORDERS.map(order => (
                 <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                   <td className="p-4 font-medium text-stone-900">{order.id}</td>
                   <td className="p-4 text-sm">{order.date}</td>
                   <td className="p-4">
                     <span className={`text-[10px] px-2 py-1 uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-stone-100 text-stone-600' : 'bg-gold-50 text-gold-600'}`}>
                       {order.status}
                     </span>
                   </td>
                   <td className="p-4 text-right font-medium text-stone-900">₹{order.total.toLocaleString()}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;

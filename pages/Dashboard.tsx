
import React from 'react';
import { useStore } from '../context/StoreContext';
import { MOCK_ORDERS } from '../services/mockData';
import { Package, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Dashboard
// User profile aur previous orders

const Dashboard = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-stone-200 pb-10">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-2 border-stone-100 object-cover" />
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-serif text-stone-900 mb-1">{user.name}</h1>
          <p className="text-stone-500 font-light">{user.email}</p>
          <span className="inline-block mt-3 px-3 py-1 bg-gold-50 text-gold-600 text-[10px] font-bold uppercase tracking-widest border border-gold-100">VIP Client</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm uppercase tracking-wider transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Orders Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-serif text-stone-900 flex items-center gap-3">
          My Orders
        </h2>

        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="bg-white border border-stone-100 p-8 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
               <p className="text-stone-900 font-bold uppercase tracking-widest text-sm mb-1">Order #{order.id}</p>
               <p className="text-stone-500 text-sm font-light">{order.date}</p>
             </div>
             <div className="text-right flex items-center gap-6">
               <span className={`text-[10px] px-3 py-1 uppercase tracking-widest font-bold border ${order.status === 'Delivered' ? 'border-stone-200 text-stone-600' : 'border-gold-200 text-gold-600'}`}>
                 {order.status}
               </span>
               <p className="text-stone-900 font-serif text-xl">₹{order.total.toLocaleString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

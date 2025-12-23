import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Firestore से यूजर का डेटा लाएं
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate('/auth'); // लॉगिन नहीं है तो Auth पेज भेजें
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center text-white text-3xl font-serif">
              {userData?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-serif text-stone-900">{userData?.fullName || 'User Name'}</h1>
              <p className="text-stone-500 text-sm">{userData?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-stone-100 text-[10px] uppercase tracking-widest rounded-full">
                {userData?.role || 'Customer'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-600 transition-colors text-sm uppercase tracking-widest font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* User Stats/Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button className="bg-white p-6 rounded-xl border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <Package className="text-stone-400" /> <span className="font-medium">My Orders</span>
          </button>
          <button className="bg-white p-6 rounded-xl border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <Heart className="text-stone-400" /> <span className="font-medium">Wishlist</span>
          </button>
          {userData?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="bg-gold-50 p-6 rounded-xl border border-gold-100 flex items-center gap-4 hover:shadow-md transition-shadow text-stone-900">
              <User className="text-gold-500" /> <span className="font-bold">Admin Panel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
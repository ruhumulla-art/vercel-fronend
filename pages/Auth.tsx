import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
// Firebase Imports
import { auth, db } from '../firebase-config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const navigate = useNavigate();

  // अगर यूजर पहले से लॉगिन है तो उसे सीधे डैशबोर्ड भेजें
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // --- REGISTRATION LOGIC ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 1. प्रोफाइल में नाम अपडेट करें
        await updateProfile(user, { displayName: fullName });

        // 2. Firestore में भविष्य के लिए डेटा सेव करें (Orders, Wishlist आदि मैनेज करने के लिए)
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          fullName: fullName,
          email: email,
          role: 'customer', // भविष्य में 'admin' रोल देने के काम आएगा
          createdAt: serverTimestamp(),
          cart: [],
          wishlist: []
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err.code);
      if (err.code === 'auth/invalid-credential') setError("Invalid email or password.");
      else if (err.code === 'auth/email-already-in-use') setError("This email is already in use.");
      else if (err.code === 'auth/weak-password') setError("Password is too weak (min 6 chars).");
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#fafaf9]">
      <div className="w-full max-w-md bg-white p-10 shadow-2xl rounded-2xl border border-stone-100 transition-all">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-stone-900 mb-3 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Lora Halle'}
          </h1>
          <p className="text-stone-500 font-light text-sm italic">
            {isLogin ? 'Luxury is a state of mind.' : 'Experience the art of fine handbags.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs animate-pulse">
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name (Only for Register) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" 
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-stone-400" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" 
              required 
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-stone-400" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold uppercase tracking-[0.2em] py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading ? (
               <Loader2 className="animate-spin" size={20}/>
            ) : (
               <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
               </>
            )}
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-10 text-center border-t border-stone-100 pt-6">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            className="text-stone-500 hover:text-stone-900 text-xs uppercase tracking-widest transition-all font-medium"
          >
            {isLogin ? "New Client? Create Account" : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
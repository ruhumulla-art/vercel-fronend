
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(); // This now returns a promise from StoreContext
      navigate('/dashboard');
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-md bg-white p-10 shadow-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-stone-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-stone-500 font-light text-sm">
            {isLogin ? 'Sign in to access your wishlist and orders.' : 'Join us for exclusive access to new collections.'}
          </p>
        </div>

        {error && (
           <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs text-center">
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input type="text" placeholder="Full Name" className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" />
          )}
          <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" defaultValue="sophia@lorahalle.com" required />
          <input type="password" placeholder="Password" className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 placeholder-stone-400" defaultValue="password" required />

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold uppercase tracking-widest py-4 transition-colors text-sm mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <><Loader2 className="animate-spin" size={16}/> Please Wait</>
            ) : (
               isLogin ? 'Sign In' : 'Register'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            className="text-stone-500 hover:text-stone-900 text-xs uppercase tracking-widest transition-colors border-b border-transparent hover:border-stone-900 pb-0.5"
          >
            {isLogin ? "New Client? Create Account" : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

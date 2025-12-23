import { useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        // चेक करें कि रोल 'admin' है या नहीं
        if (userData?.role === 'admin') {
          setIsAdmin(true);
        } else {
          navigate('/dashboard'); // एडमिन नहीं है तो बाहर भेजें
        }
      } else {
        navigate('/auth'); // लॉगिन नहीं है तो Auth पेज पर भेजें
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  return { isAdmin, checking };
};
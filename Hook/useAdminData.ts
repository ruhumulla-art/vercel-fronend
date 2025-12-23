import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const useAdminData = (collectionName: 'products' | 'orders' | 'users') => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // डेटा को समय के अनुसार (Newest First) क्रम में लाने के लिए क्वेरी
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));

    // Real-time डेटा सुनना
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(result);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  // स्टेटस अपडेट करने के लिए (जैसे Order Status: Pending to Delivered)
  const updateStatus = async (id: string, newStatus: string) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { orderStatus: newStatus });
  };

  // किसी आइटम को डिलीट करने के लिए
  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
  };

  return { data, loading, updateStatus, removeItem };
};
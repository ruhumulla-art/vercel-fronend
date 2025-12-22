import { db } from '../firebase-config';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export const saveOrder = async (cartItems: any[], total: number, customerId?: string) => {
  if (!db) return { success: false, error: "Database not found" };

  try {
    const orderData = {
      customerId: customerId || 'guest',
      items: JSON.parse(JSON.stringify(cartItems)), 
      totalAmount: Number(total),
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("✅ Order Saved ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("🔥 Firebase Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const getCustomerOrders = async (customerId: string) => {
  try {
    const q = query(collection(db, "orders"), where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    return [];
  }
};

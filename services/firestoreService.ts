import { db } from '../firebase-config'; // पाथ चेक कर लें
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';

// 1. ऑर्डर सेव करने के लिए (Checkout Page के लिए)
export const saveOrder = async (cartItems: any[], total: number, customerId?: string) => {
  try {
    const orderData = {
      customerId: customerId || 'guest',
      items: cartItems,
      totalAmount: total,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "orders"), orderData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false, error };
  }
};

// 2. कार्ट में आइटम जोड़ने के लिए (अगर आप डेटाबेस में कार्ट रखना चाहते हैं)
export const addToDbCart = async (userId: string, product: any) => {
  try {
    const docRef = await addDoc(collection(db, "userCarts"), {
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,
      addedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error };
  }
};

// 3. किसी कस्टमर के ऑर्डर्स देखने के लिए (Dashboard के लिए)
export const getCustomerOrders = async (customerId: string) => {
  try {
    const q = query(collection(db, "orders"), where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
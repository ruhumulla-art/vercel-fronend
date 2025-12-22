import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

// 1. ऑर्डर सेव करने के लिए
export const saveOrder = async (cartItems: any[], total: number, customerId?: string) => {
  console.log("🚀 FirestoreService: saveOrder प्रक्रिया शुरू...");
  
  if (!db) {
    console.error("❌ Error: Firestore Database (db) इनिशियलाइज़ नहीं हुआ है!");
    return { success: false, error: "Database instance not found" };
  }

  try {
    const orderData = {
      customerId: customerId || 'guest',
      items: JSON.parse(JSON.stringify(cartItems)), // Proxy objects फिक्स करने के लिए
      totalAmount: Number(total),
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    console.log("📤 Firebase को डेटा भेज रहे हैं:", orderData);
    
    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    console.log("✅ सफलता! Firebase में ऑर्डर आईडी:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("🔥 Firebase Save Error Detail:", error);
    return { success: false, error: error.message };
  }
};

// 2. पुराने ऑर्डर्स देखने के लिए
export const getCustomerOrders = async (customerId: string) => {
  try {
    const q = query(collection(db, "orders"), where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error("🔥 Fetch Error:", error.message);
    return [];
  }
};
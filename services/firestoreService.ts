import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

export const saveOrder = async (cartItems: any[], total: number, customerId?: string) => {
  // Debugging के लिए सबसे पहले लॉग
  console.log("🚀 FirestoreService: saveOrder प्रक्रिया शुरू...");
  
  if (!db) {
    console.error("❌ Error: Firestore Database (db) इनिशियलाइज़ नहीं हुआ है!");
    return { success: false, error: "Database instance not found" };
  }

  try {
    // डेटा को साफ़ तरीके से तैयार करना
    const orderData = {
      customerId: customerId || 'guest',
      items: JSON.parse(JSON.stringify(cartItems)), // Proxy objects को plain JSON में बदलने के लिए
      totalAmount: Number(total), // पक्का करें कि यह नंबर है
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    console.log("📤 Firebase को डेटा भेज रहे हैं:", orderData);
    
    // कलेक्शन रेफरेंस
    const ordersRef = collection(db, "orders");
    
    // डेटा सेव करना
    const docRef = await addDoc(ordersRef, orderData);
    
    console.log("✅ सफलता! Firebase में ऑर्डर आईडी:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    // विस्तृत एरर लॉगिंग
    console.error("🔥 Firebase Save Error Detail:", error);
    return { success: false, error: error.message };
  }
};

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
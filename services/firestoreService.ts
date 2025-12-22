import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
} from 'firebase/firestore';

// 1. ऑर्डर सेव करने के लिए (Checkout Page के लिए)
export const saveOrder = async (cartItems: any[], total: number, customerId?: string) => {
  console.log("📡 firestoreService: saveOrder फंक्शन कॉल हुआ है...");
  try {
    const orderData = {
      customerId: customerId || 'guest',
      items: cartItems,
      totalAmount: total,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    
    console.log("📤 Firebase के 'orders' कलेक्शन में डेटा भेज रहे हैं:", orderData);
    
    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    console.log("✨ डेटाबेस में सफलतापूर्वक सेव हुआ! ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("🔥 Firebase Error (saveOrder):", error.message);
    return { success: false, error: error.message };
  }
};

// 2. कार्ट में आइटम जोड़ने के लिए
export const addToDbCart = async (userId: string, product: any) => {
  console.log("🛒 firestoreService: addToDbCart कॉल हुआ...");
  try {
    const docRef = await addDoc(collection(db, "userCarts"), {
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,
      addedAt: serverTimestamp(),
    });
    console.log("✅ कार्ट आइटम सेव हुआ ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("🔥 Firebase Error (addToDbCart):", error.message);
    return { success: false, error: error.message };
  }
};

// 3. किसी कस्टमर के ऑर्डर्स देखने के लिए
export const getCustomerOrders = async (customerId: string) => {
  console.log("📂 firestoreService: ऑर्डर्स फेच कर रहे हैं कस्टमर के लिए:", customerId);
  try {
    const q = query(collection(db, "orders"), where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`📊 कुल ${orders.length} ऑर्डर्स मिले।`);
    return orders;
  } catch (error: any) {
    console.error("🔥 Firebase Error (getCustomerOrders):", error.message);
    return [];
  }
};
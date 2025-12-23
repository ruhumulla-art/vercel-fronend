import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// आपका ओरिजिनल कॉन्फ़िगरेशन
const firebaseConfig = {
  apiKey: "AIzaSyC18V7mJqunQIz-AZXxYC3IEkl4agKyj-U",
  authDomain: "lora-halle-2.firebaseapp.com",
  projectId: "lora-halle-2",
  storageBucket: "lora-halle-2.firebasestorage.app",
  messagingSenderId: "1005614880806",
  appId: "1:1005614880806:web:b2cb887863371267606ee7",
  measurementId: "G-8VH1WXX6YP"
};

// 1. Firebase को इनिशियलाइज़ करें
const app = initializeApp(firebaseConfig);

// 2. सर्विसेज को सेटअप करें और Export करें (ताकि दूसरी फाइलें इन्हें इस्तेमाल कर सकें)
export const db = getFirestore(app);   // Firestore डेटाबेस के लिए
export const auth = getAuth(app);      // लॉगिन/साइनअप के लिए
export const analytics = getAnalytics(app);

// 3. डिफ़ॉल्ट रूप से 'app' को एक्सपोर्ट करें
export default app;
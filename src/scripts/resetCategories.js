
/**
 * Master Reset Script: Categories Cleanup & Local Image Seeding
 * This script wipes the 'categories' collection and restores them with 
 * correct local paths and slugs to match the shop filters.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzuMziYfsSoP0I3UGqnnNNz717OBZUw2k",
  authDomain: "freshmart-da486.firebaseapp.com",
  projectId: "freshmart-da486",
  storageBucket: "freshmart-da486.firebasestorage.app",
  messagingSenderId: "114626089771",
  appId: "1:114626089771:web:254736f1ac49a9c5062b6e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newDefaults = [
  { name: 'Fresh Fruits', slug: 'fruits', imageUrl: '/images/products/f_f.png', description: 'Handpicked seasonal fruits directly from orchards.', order: 1, isActive: true },
  { name: 'Vegetables', slug: 'vegetables', imageUrl: '/images/products/tomato.png', description: 'Daily fresh vegetables from local farms.', order: 2, isActive: true },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', imageUrl: '/images/products/milk.jpg', description: 'Fresh milk, cheese, and farm-raised eggs.', order: 3, isActive: true },
  { name: 'Organic Products', slug: 'organic', imageUrl: '/images/products/palak.jpg', description: 'Pure organic produce for a healthy lifestyle.', order: 4, isActive: true }
];

const resetCategories = async () => {
  console.log("🚀 Starting Category Master Reset...");
  
  try {
    // 1. Wipe current categories
    const snapshot = await getDocs(collection(db, 'categories'));
    console.log(`Cleaning up ${snapshot.size} old categories...`);
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, 'categories', d.id));
    }
    console.log("✅ Database Cleaned.");

    // 2. Add new refined defaults
    for (const cat of newDefaults) {
      await addDoc(collection(db, 'categories'), {
        ...cat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`➕ Added Category: ${cat.name}`);
    }

    console.log("✨ SUCCESS: Categories Reset with Local Assets & Correct Slugs!");
  } catch (err) {
    console.error("❌ Reset Failed:", err);
  }
  process.exit(0);
};

resetCategories();

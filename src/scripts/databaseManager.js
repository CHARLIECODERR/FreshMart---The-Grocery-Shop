
/**
 * Database Management Script for FreshMart
 * Syncs BOTH Categories and Products with local assets.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, where } from "firebase/firestore";

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

const categories = [
  { name: "Fresh Fruits", slug: "fruits", order: 1, isActive: true, imageUrl: "/images/products/f_f.png" },
  { name: "Vegetables", slug: "vegetables", order: 2, isActive: true, imageUrl: "/images/products/vegitables.png" },
  { name: "Dairy & Eggs", slug: "dairy-eggs", order: 3, isActive: true, imageUrl: "/images/products/milk.jpg" }
];

const products = [
  {
    name: "Hapus Mango",
    description: "Premium Ratnagiri Alphonso mangoes.",
    price: 3200,
    unit: "DOZEN",
    category: "Fresh Fruits",
    categorySlug: "fruits",
    image: "/images/products/mango.jpg",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 5.0,
    reviewsCount: 450,
    discount: 36,
    originalPrice: 5000
  },
  {
    name: "Strawberry",
    description: "Fresh red strawberries.",
    price: 420,
    unit: "KG",
    category: "Fresh Fruits",
    categorySlug: "fruits",
    image: "/images/products/strawberry.jpg",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 4.8,
    reviewsCount: 320,
    discount: 30,
    originalPrice: 600
  },
  {
    name: "Fresh Tomato",
    description: "Organic red tomatoes.",
    price: 40,
    unit: "KG",
    category: "Vegetables",
    categorySlug: "vegetables",
    image: "/images/products/vegitables.png",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 4.8,
    reviewsCount: 124,
    discount: 27,
    originalPrice: 55
  },
  {
    name: "Organic Potato (Aloo)",
    description: "Premium organic potatoes.",
    price: 35,
    unit: "KG",
    category: "Vegetables",
    categorySlug: "vegetables",
    image: "/images/products/potato.png",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 4.6,
    reviewsCount: 89,
    discount: 30,
    originalPrice: 50
  },
  {
    name: "Fresh Palak (Spinach)",
    description: "Dark green fresh spinach bunches.",
    price: 25,
    unit: "Bunch",
    category: "Vegetables",
    categorySlug: "vegetables",
    image: "/images/products/palak.jpg",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 4.9,
    reviewsCount: 56,
    discount: 28,
    originalPrice: 35
  },
  {
    name: "Red Carrots (Gajar)",
    description: "Crunchy and sweet red carrots.",
    price: 60,
    unit: "KG",
    category: "Vegetables",
    categorySlug: "vegetables",
    image: "/images/products/carrot.png",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 4.7,
    reviewsCount: 42,
    discount: 29,
    originalPrice: 85
  },
  {
    name: "Full Cream Milk",
    description: "Pure dairy milk.",
    price: 66,
    unit: "Litre",
    category: "Dairy & Eggs",
    categorySlug: "dairy-eggs",
    image: "/images/products/milk.jpg",
    status: "active",
    isActive: true,
    stock: 100,
    rating: 4.8,
    reviewsCount: 312,
    discount: 12,
    originalPrice: 75
  }
];

export const syncEverything = async () => {
  console.log("🚀 Syncing Categories & Products...");
  
  // 1. Categories Sync
  const catSnap = await getDocs(collection(db, "categories"));
  for (const d of catSnap.docs) {
    await deleteDoc(doc(db, "categories", d.id));
  }
  for (const c of categories) {
    await addDoc(collection(db, "categories"), {
      ...c,
      createdAt: serverTimestamp()
    });
    console.log(`✅ Category Synced: ${c.name}`);
  }

  // 2. Products Sync
  const productSnap = await getDocs(collection(db, "products"));
  for (const d of productSnap.docs) {
    await deleteDoc(doc(db, "products", d.id));
  }
  for (const p of products) {
    await addDoc(collection(db, "products"), {
      ...p,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`📦 Product Synced: ${p.name}`);
  }
  
  console.log("✨ MASTER SYNC COMPLETE!");
  process.exit(0);
};

syncEverything();

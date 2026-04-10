
/**
 * Fix Script: updateCategorySlugs
 * This script ensures every product in the Firestore 'products' collection 
 * has a 'categorySlug' that matches the official slug from the 'categories' collection.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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

export const fixSlugs = async () => {
  console.log("Starting Category Slug Fix...");
  
  try {
    // 1. Fetch all categories to get the name -> slug mapping
    const catSnap = await getDocs(collection(db, "categories"));
    const catMap = {};
    catSnap.forEach(d => {
      const data = d.data();
      catMap[data.name] = data.slug;
    });
    console.log("Category Map Loaded:", catMap);

    // 2. Fetch all products
    const prodSnap = await getDocs(collection(db, "products"));
    console.log(`Processing ${prodSnap.size} products...`);

    let updatedCount = 0;
    for (const d of prodSnap.docs) {
      const product = d.data();
      const officialSlug = catMap[product.category];
      
      // If we found a mapping and it's different from current, update it
      if (officialSlug && product.categorySlug !== officialSlug) {
        await updateDoc(doc(db, "products", d.id), {
          categorySlug: officialSlug
        });
        console.log(`Updated [${product.name}]: ${product.categorySlug} -> ${officialSlug}`);
        updatedCount++;
      } else if (!officialSlug) {
        // Fallback slug if category doesn't exist in categories collection
        const fallback = product.category?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') || 'general';
        if (product.categorySlug !== fallback) {
          await updateDoc(doc(db, "products", d.id), {
            categorySlug: fallback
          });
          console.log(`Fallback [${product.name}]: ${product.categorySlug} -> ${fallback}`);
          updatedCount++;
        }
      }
    }

    console.log(`SUCCESS: Updated ${updatedCount} products.`);
  } catch (error) {
    console.error("Error during fix:", error);
  }
  process.exit(0);
};

fixSlugs();

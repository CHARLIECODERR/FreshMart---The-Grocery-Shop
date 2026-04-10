
/**
 * Recipe Migration Script
 * This script moves all hardcoded recipes to the Firestore 'recipes' collection.
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

const recipes = [
  {
    title: 'Palak Paneer',
    description: 'A popular North Indian dish made with succulent paneer cubes in a smooth spinach sauce.',
    image: '/images/recipes/palak_paneer.jpg',
    ingredients: ['Spinach (Palak)', 'Paneer', 'Onion', 'Tomato', 'Cream', 'Ginger-Garlic Paste'],
    cookTime: '35min',
    servings: 4,
    calories: '280 kCal',
    nutrition: { calories: '280 kCal', protein: '12 g', fat: '20 g', carbs: '10 g' },
    steps: [
      'Blanch the spinach and puree it.',
      'Sauté onions and ginger-garlic paste.',
      'Add tomato and spices. Cook until oil separates.',
      'Add spinach puree and simmer.',
      'Add paneer cubes and cream. Serve hot.'
    ],
    tags: ['spinach', 'palak', 'paneer', 'indian', 'vegetable']
  },
  {
    title: 'Crispy Aloo Fry',
    description: 'A simple and classic Indian side dish made with potatoes and aromatic spices.',
    image: 'https://www.sharmispassions.com/wp-content/uploads/2019/03/PotatoFry5.jpg',
    ingredients: ['Potatoes', 'Cumin Seeds', 'Turmeric', 'Chili Powder', 'Oil'],
    cookTime: '20min',
    servings: 3,
    calories: '200 kCal',
    nutrition: { calories: '200 kCal', protein: '4 g', fat: '8 g', carbs: '30 g' },
    steps: [
      'Peel and dice the potatoes.',
      'Heat oil and add cumin seeds.',
      'Add potatoes and spice powders.',
      'Fry on low heat until golden and crispy.'
    ],
    tags: ['potato', 'aloo', 'vegetable', 'indian']
  },
  {
    title: 'Gajar ka Halwa',
    description: 'A traditional North Indian dessert made from fresh carrots, milk, and sugar.',
    image: '/images/recipes/gajar_halwa.jpg',
    ingredients: ['Carrots (Gajar)', 'Milk', 'Sugar', 'Khoya', 'Nuts', 'Cardamom'],
    cookTime: '50min',
    servings: 5,
    calories: '350 kCal',
    nutrition: { calories: '350 kCal', protein: '7 g', fat: '15 g', carbs: '48 g' },
    steps: [
      'Grate the carrots.',
      'Cook grated carrots in milk until milk evaporates.',
      'Add sugar and khoya. Stir until it thickens.',
      'Garnish with nuts and cardamom powder.'
    ],
    tags: ['carrot', 'gajar', 'dessert', 'indian']
  },
  {
    title: 'Mixed Vegetable Curry',
    description: 'A healthy and colorful curry made with a variety of fresh seasonal vegetables.',
    image: '/images/recipes/mix_veg.jpg',
    ingredients: ['Beans', 'Carrot', 'Peas', 'Onion', 'Tomato Masala'],
    cookTime: '40min',
    servings: 4,
    calories: '180 kCal',
    nutrition: { calories: '180 kCal', protein: '5 g', fat: '6 g', carbs: '28 g' },
    steps: [
      'Chop all vegetables into uniform sizes.',
      'Prepare the onion-tomato base.',
      'Add vegetables and cook with a little water.',
      'Add garam masala and coriander leaves.'
    ],
    tags: ['vegetable', 'healthy', 'indian', 'beans', 'peas']
  },
  {
    title: 'Beetroot Halwa',
    description: 'Vibrant and delicious beetroot dessert.',
    image: '/images/recipes/beetroot_halwa.jpg',
    ingredients: ['Milk', 'Beetroot', 'Kishmish', 'Cardamom powder', 'Sugar', 'Ghee'],
    cookTime: '40min',
    servings: 6,
    calories: '320 kCal',
    nutrition: { calories: '320 kCal', protein: '6 g', fat: '12 g', carbs: '48 g' },
    steps: [
      'Grate the beetroot and sauté in ghee.',
      'Add milk and simmer until absorbed.',
      'Add sugar and cook until thick.',
      'Garnish with nuts.'
    ],
    tags: ['milk', 'beetroot', 'dessert', 'indian']
  }
];

const migrateRecipes = async () => {
  console.log("🚀 Migrating Recipes to Firestore...");
  
  try {
    // 1. Clear existing
    const snapshot = await getDocs(collection(db, "recipes"));
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, "recipes", d.id));
    }
    
    // 2. Add new
    for (const r of recipes) {
      await addDoc(collection(db, "recipes"), {
        ...r,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Migrated: ${r.title}`);
    }

    console.log("✨ Migration Complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
  process.exit(0);
};

migrateRecipes();

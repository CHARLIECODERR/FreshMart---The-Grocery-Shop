
import { collection, query, where, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'recipes';

// Fetch all recipes
export const getAllRecipes = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Fetch a single recipe by ID
export const getRecipeById = async (id) => {
  if (!id) return null;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
};

// Search recipes by tag
export const getRecipesByTag = async (tag) => {
  if (!tag) return [];
  try {
    const term = tag.toLowerCase();
    const all = await getAllRecipes();
    return all.filter(r => r.tags?.some(t => t.toLowerCase().includes(term)));
  } catch (error) {
    console.error("Error searching recipes by tag:", error);
    throw error;
  }
};

// Get recipes related to a product
export const getRecipesByProduct = async (productName) => {
  if (!productName) return [];
  try {
    const normalizedName = productName.toLowerCase();
    const productWords = normalizedName.split(/\s+/).filter(word => word.length > 2); 
    const all = await getAllRecipes();

    const map = {
      'milk': 'milk',
      'palak': 'palak',
      'spinach': 'spinach',
      'potato': 'potato',
      'aloo': 'aloo',
      'carrot': 'carrot',
      'gajar': 'gajar',
      'mango': 'mango',
      'strawberry': 'strawberry',
      'tomato': 'tomato'
    };

    const foundTag = Object.keys(map).find(key => normalizedName.includes(key));

    return all.filter(r => {
      if (foundTag && r.tags?.some(t => t.toLowerCase().includes(map[foundTag]))) return true;
      return productWords.some(word => 
        r.tags?.some(t => t.toLowerCase().includes(word)) || 
        r.ingredients?.some(i => i.toLowerCase().includes(word)) ||
        r.title?.toLowerCase().includes(word)
      );
    });
  } catch (error) {
    console.error("Error fetching related recipes:", error);
    return [];
  }
};

// Create new recipe
export const createRecipe = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

// Update recipe
export const updateRecipe = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

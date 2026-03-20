import { collection, query, where, getDocs, getDoc, doc, limit, orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const COLLECTION_NAME = 'products';

// Fetch active products with optional category filter
export const getActiveProducts = async (options = {}) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'active')
    );

    if (options.categorySlug) {
      q = query(q, where('categorySlug', '==', options.categorySlug));
    } else if (options.category) {
      q = query(q, where('category', '==', options.category));
    }

    // Default sort by creation date or order, adjust as needed based on your indexes
    // Note: To use orderBy with where, you need a composite index in Firestore.
    // If you haven't created one, just fetching without orderBy for now, or adding it.
    
    if (options.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    // Fallback: If isActive is missing, we might still want to show products 
    // that are marked as status: 'active'. But for now, we'll stick to a clean flag.
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure categorySlug exists for client-side filtering if missing
      categorySlug: doc.data().categorySlug || doc.data().category?.toLowerCase()
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw error;
  }
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && (docSnap.data().isActive || docSnap.data().status === 'active')) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const searchProducts = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return [];
  
  // Note: Firestore doesn't support native full-text search easily without external tools like Algolia.
  // We can do a basic prefix search or client-side filter for this sample.
  // For a basic string >= search on name:
  try {
    const term = searchTerm.toLowerCase();
    
    // Simplified hack: fetch active products and filter in JS
    const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where('status', '==', 'active'), limit(100)));
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return products.filter(p => 
      p.name?.toLowerCase().includes(term) || 
      p.description?.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get products by farmer ID
export const getFarmerProducts = async (farmerId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching farmer products:", error);
    throw error;
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      status: 'active',
      isActive: true, // Crucial for visibility to customers
      categorySlug: productData.category?.toLowerCase(), // Crucial for shop filtering
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...productData, isActive: true, categorySlug: productData.category?.toLowerCase() };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update existing product
export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(docRef, {
      ...productData,
      categorySlug: productData.category?.toLowerCase(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Upload product image to Cloudinary (Free & No CORS issues)
export const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

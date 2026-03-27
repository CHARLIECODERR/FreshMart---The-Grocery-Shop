import { collection, query, where, getDocs, getDoc, doc, orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'supplyOffers';

// Get supply offers by farmer ID
export const getFarmerSupplyOffers = async (farmerId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching farmer supply offers:", error);
    throw error;
  }
};

// Create new supply offer (submitted by farmer to Admin)
export const createSupplyOffer = async (offerData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...offerData,
      status: 'pending',   // 'pending' / 'accepted' / 'rejected'
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...offerData, status: 'pending' };
  } catch (error) {
    console.error("Error creating supply offer:", error);
    throw error;
  }
};

// Update existing supply offer (only if pending)
export const updateSupplyOffer = async (offerId, offerData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, offerId);
    await updateDoc(docRef, {
      ...offerData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating supply offer:", error);
    throw error;
  }
};

// Delete supply offer (only if pending)
export const deleteSupplyOffer = async (offerId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, offerId));
    return true;
  } catch (error) {
    console.error("Error deleting supply offer:", error);
    throw error;
  }
};

// Get a specific supply offer by ID
export const getSupplyOfferById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching supply offer with ID ${id}:`, error);
    throw error;
  }
};

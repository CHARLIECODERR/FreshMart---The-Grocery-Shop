import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config';

const REVIEWS_COLLECTION = 'reviews';
const PRODUCTS_COLLECTION = 'products';
const USERS_COLLECTION = 'users';

/**
 * Add a new review and update aggregate ratings for the product and farmer
 */
export const addReview = async (reviewData) => {
  try {
    const { productId, farmerId, rating } = reviewData;

    // Use a transaction to ensure data consistency
    await runTransaction(db, async (transaction) => {
      // 1. Add the review document
      const reviewRef = doc(collection(db, REVIEWS_COLLECTION));
      transaction.set(reviewRef, {
        ...reviewData,
        createdAt: serverTimestamp()
      });

      // 2. Update Product aggregates
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await transaction.get(productRef);
      
      if (productSnap.exists()) {
        const productData = productSnap.data();
        const oldTotalRating = (productData.averageRating || 0) * (productData.reviewCount || 0);
        const newReviewCount = (productData.reviewCount || 0) + 1;
        const newAverageRating = (oldTotalRating + rating) / newReviewCount;
        
        transaction.update(productRef, {
          averageRating: newAverageRating,
          reviewCount: newReviewCount,
          updatedAt: serverTimestamp()
        });
      }

      // 3. Update Farmer aggregates
      const farmerRef = doc(db, USERS_COLLECTION, farmerId);
      const farmerSnap = await transaction.get(farmerRef);
      
      if (farmerSnap.exists()) {
        const farmerData = farmerSnap.data();
        const oldTotalRating = (farmerData.averageRating || 0) * (farmerData.reviewCount || 0);
        const newReviewCount = (farmerData.reviewCount || 0) + 1;
        const newAverageRating = (oldTotalRating + rating) / newReviewCount;
        
        transaction.update(farmerRef, {
          averageRating: newAverageRating,
          reviewCount: newReviewCount,
          updatedAt: serverTimestamp()
        });
      }
    });

    return true;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

/**
 * Get all reviews for a specific product
 */
export const getProductReviews = async (productId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

/**
 * Get all reviews for a farmer's products
 */
export const getFarmerReviews = async (farmerId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching farmer reviews:", error);
    throw error;
  }
};

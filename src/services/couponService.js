import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Fetch all active coupons
 * @returns {Promise<Array>}
 */
export const getActiveCoupons = async () => {
  try {
    const q = query(collection(db, 'coupons'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(coupon => {
        if (!coupon.expiry) return true;
        return coupon.expiry >= today;
      });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

/**
 * Validate a coupon code and return its details
 * @param {string} code - The coupon code to validate
 * @returns {Promise<Object|null>}
 */
export const validateCoupon = async (code) => {
  try {
    if (!code) return null;
    const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const coupon = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    
    // Check expiry if it exists
    if (coupon.expiry) {
      const today = new Date().toISOString().split('T')[0];
      if (today > coupon.expiry) return null;
    }
    
    return coupon;
  } catch (error) {
    console.error("Error validating coupon:", error);
    return null;
  }
};

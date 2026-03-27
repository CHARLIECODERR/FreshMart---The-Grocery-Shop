import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, setDoc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getAdminStats = async () => {
  try {
    const [usersSnap, farmersSnap, productsSnap, ordersSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(query(collection(db, 'users'), where('role', '==', 'farmer'))),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'orders'))
    ]);

    const orders = ordersSnap.docs.map(doc => doc.data());
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const qSupply = query(collection(db, 'supplyOffers'), where('status', '==', 'accepted'));
    const supplySnap = await getDocs(qSupply);
    const supplyOffers = supplySnap.docs.map(doc => doc.data());
    const totalWholesalePayout = supplyOffers.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.stock || 0)), 0);
    
    return {
      totalUsers: usersSnap.size,
      totalFarmers: farmersSnap.size,
      totalProducts: productsSnap.size,
      totalOrders: ordersSnap.size,
      totalRevenue: totalRevenue.toFixed(2),
      totalWholesalePayout: totalWholesalePayout.toFixed(2),
      recentOrders: ordersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5),
      recentWholesale: supplySnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.approvedAt?.seconds || b.createdAt?.seconds || 0) - (a.approvedAt?.seconds || a.createdAt?.seconds || 0))
        .slice(0, 5)
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

export const getAllUsers = async (role = null) => {
  try {
    let q = collection(db, 'users');
    if (role) {
      q = query(q, where('role', '==', role));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      status: status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Banner Management
export const getBanners = async () => {
  try {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

export const updateBanner = async (bannerId, bannerData) => {
  try {
    const bannerRef = doc(db, 'banners', bannerId);
    await updateDoc(bannerRef, {
      ...bannerData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const addBanner = async (bannerData) => {
  try {
    const docRef = await addDoc(collection(db, 'banners'), {
      ...bannerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...bannerData };
  } catch (error) {
    console.error("Error adding banner:", error);
    throw error;
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    await deleteDoc(doc(db, 'banners', bannerId));
    return true;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

// Order Management
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Category Management
export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Global Settings Management
export const getGlobalSettings = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'settings'));
    const settings = {};
    snapshot.forEach(doc => {
      settings[doc.id] = doc.data();
    });
    return settings;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    throw error;
  }
};

export const updateGlobalSetting = async (settingId, data) => {
  try {
    console.log(`[AdminService] Attempting to update setting: ${settingId}`, data);
    const settingRef = doc(db, 'settings', settingId);
    await setDoc(settingRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`[AdminService] Successfully updated: ${settingId}`);
    return true;
  } catch (error) {
    console.error(`[AdminService] Error updating ${settingId}:`, error);
    throw error;
  }
};

// Coupon Management
export const getCoupons = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'coupons'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const addCoupon = async (couponData) => {
  try {
    const docRef = await addDoc(collection(db, 'coupons'), {
      ...couponData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...couponData };
  } catch (error) {
    console.error("Error adding coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (couponId, couponData) => {
  try {
    const couponRef = doc(db, 'coupons', couponId);
    await updateDoc(couponRef, {
      ...couponData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    return true;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

// Product Management
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const toggleProductVisibility = async (productId, isActive) => {
  try {
    await updateDoc(doc(db, 'products', productId), { isActive, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error("Error toggling product:", error);
    throw error;
  }
};

// Approve a farmer's supply offer — marks as accepted/purchased
export const approveSupplyOffer = async (offerId) => {
  try {
    await updateDoc(doc(db, 'supplyOffers', offerId), {
      status: 'accepted',
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    // Optional: Record this in a 'supplyOrders' collection for the farmer's history ledger
    return true;
  } catch (error) {
    console.error("Error approving supply offer:", error);
    throw error;
  }
};

// Reject a farmer's supply offer
export const rejectSupplyOffer = async (offerId) => {
  try {
    await updateDoc(doc(db, 'supplyOffers', offerId), {
      status: 'rejected',
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error rejecting supply offer:", error);
    throw error;
  }
};

// Get all supply offers
export const getAllSupplyOffers = async () => {
  try {
    const q = query(collection(db, 'supplyOffers'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching supply offers:", error);
    throw error;
  }
};

// Category CRUD
export const addCategory = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    await updateDoc(doc(db, 'categories', id), { ...data, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, 'categories', id));
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Get product count per category
export const getProductCountByCategory = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const counts = {};
    snapshot.docs.forEach(d => {
      const cat = d.data().category;
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  } catch (error) {
    return {};
  }
};

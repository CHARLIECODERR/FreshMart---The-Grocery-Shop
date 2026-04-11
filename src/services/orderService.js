import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc, updateDoc, serverTimestamp, runTransaction, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'orders';

// Helper to remove undefined fields before sending to Firebase
const cleanData = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    } else if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
      newObj[key] = cleanData(newObj[key]);
    }
  });
  return newObj;
};

// Place an order
export const placeOrder = async (orderData) => {
  try {
    const cleanedOrderData = cleanData(orderData);

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...cleanedOrderData,
      status: 'Placed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // In a real app, you would also decrease product stock levels here inside a transaction
    
    return { id: docRef.id, ...cleanedOrderData };
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// Get user order history
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    // If index is missing, it will throw an error with link
    throw error;
  }
};

// Get single order details
export const getOrderDetails = async (orderId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
// Link for user to create the necessary index
export const FARMER_ORDERS_INDEX_LINK = "https://console.firebase.google.com/v1/r/project/freshmart-da486/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9mcmVzaG1hcnQtZGE0ODYvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL29yZGVycy9pbmRleGVzL18QARoNCglmYXJtZXJJZHMYARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC";

// Get orders for a specific farmer
export const getFarmerOrders = async (farmerId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('farmerIds', 'array-contains', farmerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const myItems = data.items.filter(item => item.farmerId === farmerId);
      const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return { 
        id: doc.id, 
        ...data,
        myItems,
        myTotal
      };
    });
  } catch (error) {
    console.error("Error fetching farmer orders with index:", error);
    
    // Fallback: If index is missing, fetch all recent orders and filter in JS
    // This ensures the farmer sees THEIR orders even while index is building
    try {
      console.log("Attempting fallback fetch for farmer orders...");
      const fallbackQuery = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(fallbackQuery);
      
      const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const farmerOrders = allOrders.filter(order => 
        order.farmerIds?.includes(farmerId) || 
        order.items?.some(item => item.farmerId === farmerId)
      );

      return farmerOrders.map(order => {
        const myItems = order.items.filter(item => item.farmerId === farmerId);
        const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...order, myItems, myTotal };
      });
    } catch (fallbackError) {
      console.error("Fallback fetch also failed:", fallbackError);
      throw error; // Throw original error to show index link if possible
    }
  }
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const updateData = { 
      status: newStatus,
      updatedAt: serverTimestamp() 
    };
    
    // Also update orderStatus for redundancy/consistency if both are used
    updateData.orderStatus = newStatus;
    
    if (newStatus === 'Shipped') updateData.shippedAt = serverTimestamp();
    if (newStatus === 'Delivered') updateData.deliveredAt = serverTimestamp();
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Cancel an order (by customer)
export const cancelOrder = async (orderId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) throw new Error("Order not found");
    
    const orderData = docSnap.data();
    if (orderData.orderStatus !== 'Placed') {
      throw new Error(`Order cannot be cancelled as it is already ${orderData.orderStatus}`);
    }

    await updateDoc(docRef, {
      status: 'Cancelled',
      orderStatus: 'Cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

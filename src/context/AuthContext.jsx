import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getDocument, setDocument, queryDocuments, deleteDocument } from '../firebase/firestore';
import { signUp, logIn, logOut, resetPassword, logInWithGoogle } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user document to get role
        try {
          const doc = await getDocument('users', user.uid);
          if (doc) {
            setUserData(doc);
          } else {
            // Check if user exists by email (for Google linkage)
            const docs = await queryDocuments('users', 'email', '==', user.email);
            if (docs.length > 0) {
              const existingUser = docs[0];
              // Update existing document to use new Auth UID
              const migratedData = { ...existingUser, uid: user.uid };
              await setDocument('users', user.uid, migratedData);
              // Delete old document if it was under a different ID (often uid was docId)
              if (existingUser.id !== user.uid) {
                await deleteDocument('users', existingUser.id);
              }
              setUserData(migratedData);
            } else {
              setUserData({ role: 'customer' });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({ role: 'customer' });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name, role = 'customer') => {
    const user = await signUp(email, password, name);
    // Create user document in Firestore
    const newUserData = {
      uid: user.uid,
      name,
      email,
      role: role,
      status: role === 'farmer' ? 'pending_verification' : 'active',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    await setDocument('users', user.uid, newUserData);
    setUserData(newUserData);
    return user;
  };

  const login = async (email, password) => {
    return logIn(email, password);
  };

  const loginWithGoogle = async (requestedRole = 'customer') => {
    const user = await logInWithGoogle();
    
    // Check if user document exists for this UID
    let userDoc = await getDocument('users', user.uid);
    
    if (!userDoc) {
      // Check if user document exists for this EMAIL
      const docs = await queryDocuments('users', 'email', '==', user.email);
      if (docs.length > 0) {
        const existingUser = docs[0];
        userDoc = { ...existingUser, uid: user.uid };
        await setDocument('users', user.uid, userDoc);
        if (existingUser.id !== user.uid) {
          await deleteDocument('users', existingUser.id);
        }
      } else {
        // Create new
        userDoc = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          role: requestedRole,
          status: requestedRole === 'farmer' ? 'pending_verification' : 'active',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        await setDocument('users', user.uid, userDoc);
      }
    }
    
    setUserData(userDoc);
    return { user, userData: userDoc };
  };

  const logout = async () => {
    return logOut();
  };

  const value = {
    currentUser,
    userData,
    role: userData?.role || null,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

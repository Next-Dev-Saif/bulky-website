"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user data from Firestore first
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userDataFromDb = userDoc.exists() ? userDoc.data() : null;
        if (userDataFromDb) {
          setUserData(userDataFromDb);
        }
        // Sync session with cookie for middleware (include user type)
        await fetch("/api/auth/session", {
          method: "POST",
          body: JSON.stringify({
            action: "login",
            userType: userDataFromDb?.type || "client",
          }),
        });
      } else {
        setUser(null);
        setUserData(null);
        // Clear session cookie
        await fetch("/api/auth/session", {
          method: "POST",
          body: JSON.stringify({ action: "logout" }),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // Initial profile creation in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      id: userCredential.user.uid,
      email,
      type: "client",
      isActive: false,
      createdAt: serverTimestamp(),
    });
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Ensure user document exists in Firestore
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        id: result.user.uid,
        email: result.user.email,
        firstName: result.user.displayName?.split(" ")[0] || "",
        lastName: result.user.displayName?.split(" ").slice(1).join(" ") || "",
        photo: result.user.photoURL,
        type: "client",
        provider: "google",
        isActive: true,
        createdAt: serverTimestamp(),
      });
    }
    return result;
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Ensure user document exists in Firestore
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        id: result.user.uid,
        email: result.user.email,
        firstName: result.user.displayName?.split(" ")[0] || "",
        lastName: result.user.displayName?.split(" ").slice(1).join(" ") || "",
        photo: result.user.photoURL,
        type: "client",
        provider: "facebook",
        isActive: true,
        createdAt: serverTimestamp(),
      });
    }
    return result;
  };

  const deleteUserAccount = async (password) => {
    if (!user) throw new Error("No user is currently signed in");

    try {
      // 1. Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // 2. Delete from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // 3. Delete from Auth
      await deleteUser(user);

      return { success: true };
    } catch (error) {
      console.error("Account deletion error:", error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    setUserData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    deleteUserAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

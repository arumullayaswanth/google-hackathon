'use client';

import type { User as AppUser } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User as FirebaseUser, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserProfile, getUserProfile } from '@/lib/store';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        let userProfile = await getUserProfile(firebaseUser.uid);
        if (!userProfile) {
          const newUser: AppUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            score: 0,
          };
          await createUserProfile(newUser);
          userProfile = newUser;
        }
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener will handle setting the user and loading state.
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Only set loading to false on error, as onAuthStateChanged will handle it on success
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will handle setting the user state to null.
    } catch (error) {
        console.error("Error signing out: ", error);
        setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

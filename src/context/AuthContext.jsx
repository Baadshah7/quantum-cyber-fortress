/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  sendVerificationEmail: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    }, (err) => {
      console.error('onAuthStateChanged error:', err);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error('Firebase signInWithEmailAndPassword error:', err);
      const code = err.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        throw new Error('ACCESS DENIED: Invalid decrypt credentials.');
      } else if (code === 'auth/invalid-email') {
        throw new Error('ACCESS DENIED: Invalid email format.');
      } else if (code === 'auth/too-many-requests') {
        throw new Error('ACCESS DENIED: Session locked due to too many failed decryption attempts. Try again later.');
      } else {
        throw new Error(`ACCESS DENIED: ${err.message || 'Authentication handshake failure.'}`);
      }
    }
  };

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Immediately send verification email after sign up
      if (userCredential.user) {
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verifErr) {
          console.error('Initial verification email failed:', verifErr);
        }
      }
      return userCredential.user;
    } catch (err) {
      console.error('Firebase createUserWithEmailAndPassword error:', err);
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        throw new Error('ACCESS DENIED: Sentinel profile already registered.');
      } else if (code === 'auth/weak-password') {
        throw new Error('ACCESS DENIED: Password is too weak (must be >= 6 characters).');
      } else if (code === 'auth/invalid-email') {
        throw new Error('ACCESS DENIED: Invalid email format.');
      } else {
        throw new Error(`ACCESS DENIED: ${err.message || 'Registration handshake failure.'}`);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      console.error('Firebase signInWithPopup error:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signOut error:', err);
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (err) {
        console.error('Firebase sendEmailVerification error:', err);
        if (err.code === 'auth/too-many-requests') {
          throw new Error('Please wait before requesting another verification link.');
        } else {
          throw new Error(err.message || 'Failed to send verification email.');
        }
      }
    } else {
      throw new Error('No active user session detected.');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signIn,
        signUp,
        signInWithGoogle,
        signOutUser,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

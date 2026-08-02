import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'quantumcyberfortress.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'quantumcyberfortress',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'quantumcyberfortress.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
};

let app;
try {
  console.log('Firebase API key loaded:', import.meta.env.VITE_FIREBASE_API_KEY ? 'YES' : 'NO');
  console.log('Vite Env Keys:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn('VITE_FIREBASE_API_KEY is missing. Verify your .env setup and restart your dev server.');
  }
  app = initializeApp(firebaseConfig);
} catch (err) {
  console.error('Firebase client failed to initialize:', err);
  // Fallback placeholder configuration to prevent fatal loading crashes
  app = initializeApp({
    apiKey: 'placeholder-api-key',
    authDomain: 'placeholder.firebaseapp.com',
    projectId: 'placeholder-project-id',
  });
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

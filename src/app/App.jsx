import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { SentinelProgressProvider } from '@/context/SentinelProgressContext';
import { AuthProvider } from '@/context/AuthContext';
import { COLORS } from '@/design-system/tokens';
import '@/styles/globals.css';

export default function App() {
  useEffect(() => {
    Object.entries(COLORS).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, []);

  return (
    <AuthProvider>
      <SentinelProgressProvider>
        <RouterProvider router={router} />
      </SentinelProgressProvider>
    </AuthProvider>
  );
}



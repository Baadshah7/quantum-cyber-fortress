import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {/* Themed loading spinner */}
        <div className="w-12 h-12 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-text-secondary tracking-widest uppercase animate-pulse">
          Resolving Secure Sentinel Session...
        </span>
      </div>
    );
  }

  if (!user) {
    // Redirect to home and supply context error
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location, 
          authError: 'ACCESS DENIED: Authenticate credentials to enter the fortress.' 
        }} 
        replace 
      />
    );
  }

  return children;
}

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Shield, Mail, Key, ShieldAlert, Cpu } from 'lucide-react';

export default function GateAuthPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { reducedMotion } = useReducedMotion();

  // Mode state: 'signin' | 'signup'
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading & error states
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState(location.state?.authError || '');

  const handleModeToggle = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setValidationError('');
    setApiError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    // Client-side validations
    if (!email || !password) {
      setValidationError('Credentials incomplete. Provide email and password.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Security strength mismatch. Password must be >= 6 characters.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setValidationError('Authentication match failed. Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setValidationError('Access Request sent. If email verification is enabled, verify your email.');
        setSubmitting(false);
        return;
      }
      // Redirect to watchtower on successful auth
      const origin = location.state?.from?.pathname || '/watchtower';
      navigate(origin, { replace: true });
    } catch (err) {
      console.error('Auth action failed:', err);
      // Friendly messages for Supabase errors
      const errMsg = err.message || 'Access Denied: Internal gate exception.';
      if (errMsg.includes('Invalid login credentials')) {
        setApiError('ACCESS DENIED: Invalid decrypt credentials.');
      } else if (errMsg.includes('User already registered')) {
        setApiError('ACCESS DENIED: Sentinel profile already registered.');
      } else {
        setApiError(`ACCESS DENIED: ${errMsg}`);
      }
    } finally {
      if (mode === 'signin') {
        setSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setValidationError('');
    setApiError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google OAuth failed:', err);
      setApiError(`OAUTH FAILURE: ${err.message || 'Handshake failed.'}`);
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5 border border-border-subtle bg-bg-secondary/40 relative overflow-hidden select-none">
      {/* Dynamic scanlines for Access Terminal */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, var(--accent-cyan) 0px, var(--accent-cyan) 1px, transparent 1px, transparent 4px)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-cyan" />
            <span className="text-[10px] font-mono tracking-widest text-text-muted font-bold">ACCESS TERMINAL</span>
          </div>
          <Badge variant={mode === 'signin' ? 'cyan' : 'violet'} className="text-[8px] font-mono">
            {mode === 'signin' ? 'SIGN_IN_V1' : 'REQ_ACCESS_V1'}
          </Badge>
        </div>

        {/* Alerts / Error Messages */}
        {(apiError || validationError) && (
          <div className="flex gap-2.5 items-start p-3 bg-status-critical/10 border border-status-critical/20 rounded-btn text-status-critical font-mono text-[10px] leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 text-status-critical" />
            <div className="flex-1">
              <span className="font-bold tracking-wider">[ALERT]</span>{' '}
              {validationError || apiError}
            </div>
          </div>
        )}

        {/* Access Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className="font-mono text-[9px] text-text-muted tracking-wider uppercase flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-accent-cyan" /> SENTINEL EMAIL
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@fortress.net"
              className="w-full bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary placeholder:text-text-muted/65"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="font-mono text-[9px] text-text-muted tracking-wider uppercase flex items-center gap-1.5">
              <Key className="w-3 h-3 text-accent-cyan" /> DECRYPT PASSWORD
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan font-mono text-text-primary placeholder:text-text-muted/65"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-confirm" className="font-mono text-[9px] text-text-muted tracking-wider uppercase flex items-center gap-1.5">
                <Key className="w-3 h-3 text-accent-violet" /> VERIFY PASSWORD
              </label>
              <input
                id="auth-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-bg-primary/50 border border-border-subtle rounded-btn px-3 py-2 text-xs focus:outline-none focus:border-accent-violet font-mono text-text-primary placeholder:text-text-muted/65"
                required
              />
            </div>
          )}

          <Button
            type="submit"
            variant={mode === 'signin' ? 'primary' : 'secondary'}
            size="sm"
            disabled={submitting}
            className="w-full text-xs font-mono font-bold tracking-wider mt-2 shadow-glow-cyan"
            icon={submitting && (
              <span className="w-2 h-2 rounded-full bg-bg-primary animate-pulse" />
            )}
            iconPosition="left"
          >
            {submitting 
              ? 'TRANSMITTING CREDENTIALS...' 
              : mode === 'signin' 
                ? 'INITIALIZE DECRYPT' 
                : 'SUBMIT ACCESS REQUEST'}
          </Button>
        </form>

        <div className="flex items-center justify-between text-[9px] font-mono text-text-muted my-1.5">
          <div className="h-[1px] bg-border-subtle/50 flex-1" />
          <span className="px-2">OR SECURE INTERCONNECT</span>
          <div className="h-[1px] bg-border-subtle/50 flex-1" />
        </div>

        {/* Google Provider Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={submitting}
          onClick={handleGoogleSignIn}
          className="w-full text-xs font-mono tracking-wider font-semibold border-border-subtle text-text-secondary hover:border-accent-cyan/40"
          icon={<Cpu className="w-3.5 h-3.5 text-accent-cyan" />}
          iconPosition="left"
        >
          CONTINUE WITH GOOGLE
        </Button>

        {/* Toggle Mode */}
        <div className="text-[10px] font-mono text-center mt-2 border-t border-border-subtle/30 pt-3">
          <span className="text-text-muted">
            {mode === 'signin' ? 'No active Sentinel profile?' : 'Sentinel credentials ready?'}
          </span>{' '}
          <button
            onClick={handleModeToggle}
            className={`font-bold hover:underline cursor-pointer focus:outline-none ${
              mode === 'signin' ? 'text-accent-violet' : 'text-accent-cyan'
            }`}
          >
            {mode === 'signin' ? 'Request Access' : 'Sign In'}
          </button>
        </div>
      </div>
    </Card>
  );
}

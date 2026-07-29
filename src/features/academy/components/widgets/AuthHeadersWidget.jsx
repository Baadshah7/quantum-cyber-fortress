import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function AuthHeadersWidget({ onComplete }) {
  const [headerKey, setHeaderKey] = useState('X-Access-Token');
  const [authMethod, setAuthMethod] = useState('Basic');
  const [tokenValue, setTokenValue] = useState('qcf_dev_session_token_key');
  const [submitted, setSubmitted] = useState(false);

  const isSuccess = headerKey === 'Authorization' && authMethod === 'Bearer' && tokenValue.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (isSuccess) {
      onComplete({ success: true });
    } else {
      onComplete({ success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">HEADER PAYLOAD CONSOLE</span>
        {submitted && (
          <Badge status={isSuccess ? 'success' : 'critical'}>
            {isSuccess ? 'LINK VERIFIED' : 'INVALID HEADER MASK'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex flex-col gap-2">
          <label htmlFor="header-key" className="text-text-muted">HTTP HEADER KEY</label>
          <select
            id="header-key"
            value={headerKey}
            onChange={(e) => { setHeaderKey(e.target.value); setSubmitted(false); }}
            className="bg-bg-primary border border-border-subtle rounded-btn p-2 text-text-primary focus:outline-none focus:border-accent-cyan cursor-pointer"
          >
            <option value="X-Access-Token">X-Access-Token</option>
            <option value="Cookie">Cookie</option>
            <option value="Authorization">Authorization</option>
            <option value="Proxy-Authenticate">Proxy-Authenticate</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="auth-method" className="text-text-muted">AUTHENTICATION METHOD</label>
          <select
            id="auth-method"
            value={authMethod}
            onChange={(e) => { setAuthMethod(e.target.value); setSubmitted(false); }}
            className="bg-bg-primary border border-border-subtle rounded-btn p-2 text-text-primary focus:outline-none focus:border-accent-cyan cursor-pointer"
          >
            <option value="Basic">Basic</option>
            <option value="Digest">Digest</option>
            <option value="Bearer">Bearer</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xs font-mono">
        <label htmlFor="token-input" className="text-text-muted">SESSION ACCESS TOKEN VALUE</label>
        <input
          id="token-input"
          type="text"
          value={tokenValue}
          onChange={(e) => { setTokenValue(e.target.value); setSubmitted(false); }}
          className="bg-bg-primary border border-border-subtle rounded-btn p-2 text-text-primary focus:outline-none focus:border-accent-cyan"
          placeholder="Enter authorization token..."
        />
      </div>

      <div className="p-3 bg-bg-primary/50 border border-border-subtle rounded-btn font-mono text-[11px] flex flex-col gap-1">
        <span className="text-text-muted">RAW REQUEST HEADER STREAM:</span>
        <div className="text-accent-cyan mt-1 break-all">
          {headerKey}: {authMethod !== 'None' ? `${authMethod} ` : ''}{tokenValue || '<token-value>'}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-1">
        {submitted && !isSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-status-critical mr-auto">
            <ShieldAlert className="w-4 h-4" />
            <span>Format must be &ldquo;Authorization: Bearer &lt;token&gt;&rdquo;.</span>
          </div>
        )}
        {submitted && isSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-status-success mr-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Request accepted.</span>
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={<Cpu className="w-3.5 h-3.5" />}
        >
          SEND PAYLOAD
        </Button>
      </div>
    </form>
  );
}

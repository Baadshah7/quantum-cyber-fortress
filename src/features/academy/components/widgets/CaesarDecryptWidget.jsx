import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, Key } from 'lucide-react';

export default function CaesarDecryptWidget({ onComplete }) {
  const [shift, setShift] = useState(0);
  const [mode, setMode] = useState('encrypt'); // encrypt | decrypt
  const ciphertext = 'VHQLWQLHO';

  const decryptChar = (char, s, m) => {
    let sVal = parseInt(s, 10);
    if (m === 'decrypt') {
      sVal = 26 - (sVal % 26);
    }
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + sVal) % 26) + 65);
    }
    return char;
  };

  const output = ciphertext.split('').map(c => decryptChar(c, shift, mode)).join('');
  const isSuccess = mode === 'decrypt' && parseInt(shift, 10) === 3 && output === 'SENTINEL';

  const handleTest = () => {
    if (isSuccess) {
      onComplete({ success: true });
    } else {
      onComplete({ success: false });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">CIPHER ROTATION PANEL</span>
        <Badge status={isSuccess ? 'success' : 'warning'}>
          {isSuccess ? 'DECRYPTED' : 'UNRESOLVED'}
        </Badge>
      </div>

      <div className="p-3 bg-bg-primary/60 border border-border-subtle/50 rounded-btn flex justify-between items-center font-mono text-xs">
        <div>
          <span className="text-text-muted">ENCRYPTED INPUT:</span>
          <span className="text-status-critical font-bold ml-2 tracking-wider">{ciphertext}</span>
        </div>
        <div>
          <span className="text-text-muted">TRANSLATION:</span>
          <span className="text-accent-cyan font-bold ml-2 tracking-wider">{output}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex flex-col gap-2">
          <label htmlFor="shift-input" className="text-text-muted">SHIFT VALUE ({shift})</label>
          <input
            id="shift-input"
            type="range"
            min="0"
            max="10"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value, 10))}
            className="w-full bg-bg-primary accent-accent-cyan rounded-lg appearance-none h-1.5 cursor-pointer focus-visible:outline-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="caesar-widget-mode" className="text-text-muted">OPERATIONAL MODE</label>
          <div className="flex gap-2">
            <button
              type="button"
              id="caesar-widget-mode"
              onClick={() => setMode('encrypt')}
              className={`flex-1 py-1.5 border text-center rounded-btn transition-colors cursor-pointer ${
                mode === 'encrypt'
                  ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                  : 'border-border-subtle text-text-secondary hover:text-text-primary'
              }`}
            >
              Encrypt (+)
            </button>
            <button
              type="button"
              onClick={() => setMode('decrypt')}
              className={`flex-1 py-1.5 border text-center rounded-btn transition-colors cursor-pointer ${
                mode === 'decrypt'
                  ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                  : 'border-border-subtle text-text-secondary hover:text-text-primary'
              }`}
            >
              Decrypt (-)
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-1">
        {isSuccess ? (
          <div className="flex items-center gap-1.5 text-xs text-status-success mr-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Sentinel signature unlocked.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-status-warning mr-auto">
            <ShieldAlert className="w-4 h-4" />
            <span>Target translation not achieved.</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleTest}
          icon={<Key className="w-3.5 h-3.5" />}
        >
          SUBMIT KEY
        </Button>
      </div>
    </div>
  );
}

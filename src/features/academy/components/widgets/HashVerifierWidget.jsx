import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, Check } from 'lucide-react';

const HASHES = [
  { id: 'h1', value: 'd8c11f7c132890db02e1c94b7fcd88e910245a', label: 'Signature Alpha (Secure Registry)', match: true },
  { id: 'h2', value: 'd8c11f7c132890db02e1c94b7fcd88e910245b', label: 'Signature Beta (Developer Sandbox)', match: false },
  { id: 'h3', value: 'a3f282c03848b940de921318bc00e128cb52361', label: 'Signature Gamma (External Repository)', match: false }
];

export default function HashVerifierWidget({ onComplete }) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const receivedHash = 'd8c11f7c132890db02e1c94b7fcd88e910245a';

  const selectedHash = HASHES.find(h => h.id === selectedId);
  const isSuccess = selectedHash?.match === true;

  const handleSubmit = () => {
    setSubmitted(true);
    if (isSuccess) {
      onComplete({ success: true });
    } else {
      onComplete({ success: false });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">INTEGRITY VERIFICATION BOARD</span>
        {submitted && (
          <Badge status={isSuccess ? 'success' : 'critical'}>
            {isSuccess ? 'INTEGRITY VERIFIED' : 'TAMPERED FILE'}
          </Badge>
        )}
      </div>

      <div className="p-3 bg-bg-primary/60 border border-border-subtle/50 rounded-btn font-mono text-xs flex flex-col gap-1.5">
        <span className="text-text-muted">RECEIVED FILE CHECKSUM:</span>
        <span className="text-accent-cyan font-bold break-all">{receivedHash}</span>
      </div>

      <p className="text-xs text-text-secondary">
        Compare and select the registry signature hash that matches the file checksum to verify firmware authenticity.
      </p>

      <div className="flex flex-col gap-2 font-mono text-xs">
        {HASHES.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => { setSelectedId(h.id); setSubmitted(false); }}
            className={`w-full text-left p-3 border rounded-btn transition-colors focus:outline-none focus:border-accent-cyan cursor-pointer ${
              selectedId === h.id
                ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                : 'border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-primary/25'
            }`}
          >
            <div className="flex justify-between font-bold text-[10px] text-text-primary mb-1">
              <span>{h.label}</span>
              {selectedId === h.id && <span className="text-accent-cyan">SELECTED</span>}
            </div>
            <span className="break-all text-[11px] block mt-0.5">{h.value}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-1 font-mono text-xs">
        {submitted && !isSuccess && (
          <div className="flex items-center gap-1.5 text-status-critical mr-auto">
            <ShieldAlert className="w-4 h-4" />
            <span>Mismatch detected. Secure signature hash must align byte-for-byte.</span>
          </div>
        )}
        {submitted && isSuccess && (
          <div className="flex items-center gap-1.5 text-status-success mr-auto font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Cryptographic signature verified. Binary matches secure master.</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={selectedId === null}
          icon={<Check className="w-3.5 h-3.5" />}
        >
          VERIFY CHECKSUM
        </Button>
      </div>
    </div>
  );
}

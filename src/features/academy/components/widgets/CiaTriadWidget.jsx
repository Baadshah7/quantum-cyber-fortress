import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, Check } from 'lucide-react';

export default function CiaTriadWidget({ onComplete }) {
  const [a, setA] = useState('Unassigned');
  const [b, setB] = useState('Unassigned');
  const [c, setC] = useState('Unassigned');
  const [submitted, setSubmitted] = useState(false);

  const isSuccess = a === 'Confidentiality' && b === 'Integrity' && c === 'Availability';

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
        <span className="font-mono text-xs text-text-muted">CIA CONTROLS ASSESSMENT</span>
        {submitted && (
          <Badge status={isSuccess ? 'success' : 'critical'}>
            {isSuccess ? 'CONTROLS APPLIED' : 'TRIAD MISMATCH'}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 text-xs font-ui">
        {/* Scenario 1 */}
        <div className="p-3 bg-bg-primary/50 border border-border-subtle rounded-btn flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-text-secondary">A: Encrypting user passwords in database tables</span>
          <select
            value={a}
            onChange={(e) => { setA(e.target.value); setSubmitted(false); }}
            className="bg-bg-primary border border-border-subtle rounded-btn p-1.5 text-text-primary text-xs font-mono focus:outline-none focus:border-accent-cyan cursor-pointer w-full sm:w-40 shrink-0"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Confidentiality">Confidentiality</option>
            <option value="Integrity">Integrity</option>
            <option value="Availability">Availability</option>
          </select>
        </div>

        {/* Scenario 2 */}
        <div className="p-3 bg-bg-primary/50 border border-border-subtle rounded-btn flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-text-secondary">B: Verifying file hashes to ensure no changes occurred</span>
          <select
            value={b}
            onChange={(e) => { setB(e.target.value); setSubmitted(false); }}
            className="bg-bg-primary border border-border-subtle rounded-btn p-1.5 text-text-primary text-xs font-mono focus:outline-none focus:border-accent-cyan cursor-pointer w-full sm:w-40 shrink-0"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Confidentiality">Confidentiality</option>
            <option value="Integrity">Integrity</option>
            <option value="Availability">Availability</option>
          </select>
        </div>

        {/* Scenario 3 */}
        <div className="p-3 bg-bg-primary/50 border border-border-subtle rounded-btn flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-text-secondary">C: Setting up mirrored databases in multiple data centers</span>
          <select
            value={c}
            onChange={(e) => { setC(e.target.value); setSubmitted(false); }}
            className="bg-bg-primary border border-border-subtle rounded-btn p-1.5 text-text-primary text-xs font-mono focus:outline-none focus:border-accent-cyan cursor-pointer w-full sm:w-40 shrink-0"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Confidentiality">Confidentiality</option>
            <option value="Integrity">Integrity</option>
            <option value="Availability">Availability</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-1 font-mono text-xs">
        {submitted && !isSuccess && (
          <div className="flex items-center gap-1.5 text-status-critical mr-auto">
            <ShieldAlert className="w-4 h-4" />
            <span>Map controls correctly to protect data.</span>
          </div>
        )}
        {submitted && isSuccess && (
          <div className="flex items-center gap-1.5 text-status-success mr-auto font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Alignment synced.</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          icon={<Check className="w-3.5 h-3.5" />}
        >
          VERIFY TRIAD
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function SqliSanitizeWidget({ onComplete }) {
  const [escapeQuotes, setEscapeQuotes] = useState(false);
  const [parameterize, setParameterize] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSuccess = escapeQuotes && parameterize;

  const getQueryString = () => {
    if (escapeQuotes && parameterize) {
      return `// Prepared Statement (SECURE)\nPREPARE stmt FROM 'SELECT * FROM users WHERE user = ?';\nEXECUTE stmt USING @user_input;`;
    }
    if (escapeQuotes) {
      return `SELECT * FROM users WHERE user = 'admin\\' OR \\'1\\'=\\'1';`;
    }
    if (parameterize) {
      return `SELECT * FROM users WHERE user = ?;`;
    }
    return `SELECT * FROM users WHERE user = 'admin' OR '1'='1';`;
  };

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
        <span className="font-mono text-xs text-text-muted">SQL QUERY BUILDER CONSOLE</span>
        {submitted && (
          <Badge status={isSuccess ? 'success' : 'critical'}>
            {isSuccess ? 'QUERY SANITIZED' : 'INJECTION DETECTED'}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <label className="flex items-center gap-3 p-3 bg-bg-primary/45 border border-border-subtle rounded-btn cursor-pointer">
          <input
            type="checkbox"
            checked={escapeQuotes}
            onChange={(e) => { setEscapeQuotes(e.target.checked); setSubmitted(false); }}
            className="accent-accent-cyan shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-bold text-text-primary">Escape Single Quotes</span>
            <span className="text-[10px] text-text-secondary mt-0.5">Filter inputs to prevent breaking SQL syntax boundaries.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-bg-primary/45 border border-border-subtle rounded-btn cursor-pointer">
          <input
            type="checkbox"
            checked={parameterize}
            onChange={(e) => { setParameterize(e.target.checked); setSubmitted(false); }}
            className="accent-accent-cyan shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-bold text-text-primary">Use Parameterized Queries</span>
            <span className="text-[10px] text-text-secondary mt-0.5">Bind inputs as data fields, never executing them as commands.</span>
          </div>
        </label>
      </div>

      {/* Query Display Box */}
      <div className="p-3 bg-bg-primary/75 border border-border-subtle rounded-btn font-mono text-[10.5px] leading-relaxed flex flex-col gap-1.5 min-h-[90px]">
        <span className="text-text-muted">RENDERED SQL INTERNET EXECUTABLE:</span>
        <pre className="text-accent-cyan whitespace-pre-wrap mt-0.5 font-bold">
          {getQueryString()}
        </pre>
      </div>

      <div className="flex justify-end gap-3 mt-1 font-mono text-xs">
        {submitted && !isSuccess && (
          <div className="flex items-center gap-1.5 text-status-critical mr-auto">
            <ShieldAlert className="w-4 h-4" />
            <span>Apply both parameter validation and escape filters.</span>
          </div>
        )}
        {submitted && isSuccess && (
          <div className="flex items-center gap-1.5 text-status-success mr-auto font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Database parameters hardened.</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          icon={<Cpu className="w-3.5 h-3.5" />}
        >
          EXECUTE QUERY
        </Button>
      </div>
    </div>
  );
}

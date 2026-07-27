import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Lock } from 'lucide-react';

export default function PlaceholderVault() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center text-center py-12 px-4">
      <div className="p-4 bg-accent-violet/10 border border-accent-violet/20 rounded-full text-accent-violet">
        <Lock className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight md:text-5xl">
        Vault
      </h1>
      <p className="text-lg font-ui text-text-secondary max-w-xl leading-relaxed">
        Your secure locker for achievements, progress statistics, and earned badges. Access your public-facing Sentinel portfolio.
      </p>
      <Card className="p-8 max-w-md w-full flex flex-col gap-4 mt-6">
        <Badge status="coming-soon" className="mx-auto">Zone Status: Coming Soon</Badge>
        <span className="font-mono text-xs text-text-muted">VAULT_LOCKED</span>
        <div className="h-[1px] bg-border-subtle w-full my-2" />
        <p className="text-sm font-ui text-text-secondary">
          Detailed badge showcases, cryptographically-signed certificates, and shareable resume summaries will be enabled here.
        </p>
      </Card>
    </div>
  );
}


import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Terminal } from 'lucide-react';

export default function PlaceholderSimulator() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center text-center py-12 px-4">
      <div className="p-4 bg-status-warning/10 border border-status-warning/20 rounded-full text-status-warning">
        <Terminal className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight md:text-5xl">
        Training Yard
      </h1>
      <p className="text-lg font-ui text-text-secondary max-w-xl leading-relaxed">
        Test your defensive instincts in zero-risk environments. Interactive simulations for password cracking, phishing detection, and email header analysis.
      </p>
      <Card className="p-8 max-w-md w-full flex flex-col gap-4 mt-6">
        <Badge variant="warning" className="mx-auto">Zone Status: Coming Soon</Badge>
        <span className="font-mono text-xs text-text-muted">SIMULATOR_SANDBOX_OFFLINE</span>
        <div className="h-[1px] bg-border-subtle w-full my-2" />
        <p className="text-sm font-ui text-text-secondary">
          Gamified training simulators, phishing inspection tools, and sandboxed password hash checkers will be added here.
        </p>
      </Card>
    </div>
  );
}


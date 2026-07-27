import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Shield } from 'lucide-react';

export default function PlaceholderGate() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center text-center py-12 px-4">
      <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan">
        <Shield className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight md:text-5xl">
        The Gate
      </h1>
      <p className="text-lg font-ui text-text-secondary max-w-xl leading-relaxed">
        Welcome to the Quantum Cyber Fortress. This immersive landing zone serves as your entry portal to verify credentials and establish your Sentinel connection.
      </p>
      <Card className="p-8 max-w-md w-full flex flex-col gap-4 mt-6">
        <Badge status="active" className="mx-auto">Zone Status: Active</Badge>
        <span className="font-mono text-xs text-text-muted">GATE_INITIALIZATION_OK</span>
        <div className="h-[1px] bg-border-subtle w-full my-2" />
        <p className="text-sm font-ui text-text-secondary">
          Detailed landing animations, interactive fortress entry sequences, and Sentinel account synchronization are coming soon in this module.
        </p>
      </Card>
    </div>
  );
}


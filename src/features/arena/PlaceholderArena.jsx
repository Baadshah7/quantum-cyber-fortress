import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Swords } from 'lucide-react';

export default function PlaceholderArena() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center text-center py-12 px-4">
      <div className="p-4 bg-status-critical/10 border border-status-critical/20 rounded-full text-status-critical">
        <Swords className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight md:text-5xl">
        Arena
      </h1>
      <p className="text-lg font-ui text-text-secondary max-w-xl leading-relaxed">
        Put your skills to the ultimate test in competitive CTF-style challenges. Solve network puzzles, decrypt hashes, and patch vulnerable configurations.
      </p>
      <Card className="p-8 max-w-md w-full flex flex-col gap-4 mt-6">
        <Badge status="coming-soon" className="mx-auto">Zone Status: Coming Soon</Badge>
        <span className="font-mono text-xs text-text-muted">ARENA_CTF_STANDBY</span>
        <div className="h-[1px] bg-border-subtle w-full my-2" />
        <p className="text-sm font-ui text-text-secondary">
          Capture-the-flag scoring systems, complex security puzzles, and dynamic threat injection environments will be activated soon.
        </p>
      </Card>
    </div>
  );
}


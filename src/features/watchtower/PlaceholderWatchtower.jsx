import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Radio } from 'lucide-react';

export default function PlaceholderWatchtower() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center text-center py-12 px-4">
      <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan">
        <Radio className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight md:text-5xl">
        Watchtower
      </h1>
      <p className="text-lg font-ui text-text-secondary max-w-xl leading-relaxed">
        Stay updated with real-time cybersecurity news and live threat intelligence feeds. Know what threat vectors are active globally.
      </p>
      <Card className="p-8 max-w-md w-full flex flex-col gap-4 mt-6">
        <Badge status="coming-soon" className="mx-auto">Zone Status: Coming Soon</Badge>
        <span className="font-mono text-xs text-text-muted">WATCHTOWER_FEED_OFFLINE</span>
        <div className="h-[1px] bg-border-subtle w-full my-2" />
        <p className="text-sm font-ui text-text-secondary">
          Live RSS parsing, threat alert notification banners, and interactive security feeds will be added to this watchtower in the future.
        </p>
      </Card>
    </div>
  );
}


import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { StatCounter } from '@/design-system/components/StatCounter';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { LayoutDashboard, Shield, Swords, Zap } from 'lucide-react';
import { COLORS } from '@/design-system/tokens';

const dummyData = [
  { name: 'Day 1', xp: 120 },
  { name: 'Day 2', xp: 240 },
  { name: 'Day 3', xp: 180 },
  { name: 'Day 4', xp: 320 },
  { name: 'Day 5', xp: 450 },
  { name: 'Day 6', xp: 400 },
  { name: 'Day 7', xp: 520 },
];

export default function PlaceholderDashboard() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 py-6 px-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-cyan/15 rounded-btn text-accent-cyan">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">War Room</h1>
          <p className="text-sm font-ui text-text-secondary">Overview of fortress operations, defense metrics, and progress logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCounter value="Level 1" label="Sentinel Status" icon={Shield} variant="cyan" />
        <StatCounter value="120 / 500" label="Current Experience" icon={Zap} variant="violet" />
        <StatCounter value="1 Blocked" label="Threats Addressed" icon={Swords} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-display font-semibold text-text-primary">Experience Tracker (Vite Pipeline Check)</h3>
            <Badge variant="cyan">Simulated Data</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS['accent-cyan']} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS['accent-cyan']} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={COLORS['text-muted']} fontSize={11} tickLine={false} />
                <YAxis stroke={COLORS['text-muted']} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: COLORS['bg-tertiary'],
                    border: `1px solid ${COLORS['border-subtle']}`,
                    borderRadius: '8px',
                    color: COLORS['text-primary']
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke={COLORS['accent-cyan']}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorXp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-display font-semibold text-text-primary">Fortress Telemetry</h3>
            <p className="text-xs font-ui text-text-secondary">Next phase will enable real widgets mapping simulator success rates, active CTF status, and achievements.</p>
          </div>
          <div className="p-4 bg-bg-tertiary rounded-card border border-border-subtle/50 text-center flex flex-col gap-2">
            <span className="text-xs font-mono text-text-muted">SYSTEMS_INTEGRATION_STANDBY</span>
            <p className="text-xs text-text-secondary">Telemetry modules are offline. Complete training yard simulators to feed data into these graphs.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}


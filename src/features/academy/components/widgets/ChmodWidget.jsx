import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { ShieldCheck, ShieldAlert, Terminal } from 'lucide-react';

export default function ChmodWidget({ onComplete }) {
  const [owner, setOwner] = useState({ r: true, w: true, x: true });
  const [group, setGroup] = useState({ r: true, w: false, x: false });
  const [world, setWorld] = useState({ r: true, w: false, x: false });

  const getOctal = (perm) => {
    let val = 0;
    if (perm.r) val += 4;
    if (perm.w) val += 2;
    if (perm.x) val += 1;
    return val;
  };

  const oOctal = getOctal(owner);
  const gOctal = getOctal(group);
  const wOctal = getOctal(world);
  const mask = `${oOctal}${gOctal}${wOctal}`;

  const isSuccess = mask === '600';

  const handleSubmit = () => {
    if (isSuccess) {
      onComplete({ success: true });
    } else {
      onComplete({ success: false });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-bg-secondary/40 border border-border-subtle rounded-btn font-ui">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-text-muted">CHMOD MASK CONSOLE</span>
        <Badge status={isSuccess ? 'success' : 'critical'}>
          MASK: {mask}
        </Badge>
      </div>

      <div className="p-3 bg-bg-primary/60 border border-border-subtle/50 rounded-btn font-mono text-xs flex justify-between items-center">
        <span className="text-text-muted">Target Mask: <strong className="text-status-success font-bold">600</strong> (Owner read/write, Group/Others none)</span>
        <span className="text-accent-cyan font-bold">{isSuccess ? 'TARGET MATCH' : 'UNSECURE FILE'}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs font-mono text-center">
        {/* Owner */}
        <div className="flex flex-col gap-2 p-3 bg-bg-primary/30 border border-border-subtle rounded-btn">
          <span className="text-accent-cyan font-bold">OWNER</span>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Read (4)</span>
              <input type="checkbox" checked={owner.r} onChange={e => setOwner(prev => ({ ...prev, r: e.target.checked }))} className="accent-accent-cyan" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Write (2)</span>
              <input type="checkbox" checked={owner.w} onChange={e => setOwner(prev => ({ ...prev, w: e.target.checked }))} className="accent-accent-cyan" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Exec (1)</span>
              <input type="checkbox" checked={owner.x} onChange={e => setOwner(prev => ({ ...prev, x: e.target.checked }))} className="accent-accent-cyan" />
            </label>
          </div>
          <span className="text-sm font-bold text-accent-cyan border-t border-border-subtle/30 pt-2 mt-1">{oOctal}</span>
        </div>

        {/* Group */}
        <div className="flex flex-col gap-2 p-3 bg-bg-primary/30 border border-border-subtle rounded-btn">
          <span className="text-accent-violet font-bold">GROUP</span>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Read (4)</span>
              <input type="checkbox" checked={group.r} onChange={e => setGroup(prev => ({ ...prev, r: e.target.checked }))} className="accent-accent-cyan" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Write (2)</span>
              <input type="checkbox" checked={group.w} onChange={e => setGroup(prev => ({ ...prev, w: e.target.checked }))} className="accent-accent-cyan" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Exec (1)</span>
              <input type="checkbox" checked={group.x} onChange={e => setGroup(prev => ({ ...prev, x: e.target.checked }))} className="accent-accent-cyan" />
            </label>
          </div>
          <span className="text-sm font-bold text-accent-violet border-t border-border-subtle/30 pt-2 mt-1">{gOctal}</span>
        </div>

        {/* World */}
        <div className="flex flex-col gap-2 p-3 bg-bg-primary/30 border border-border-subtle rounded-btn">
          <span className="text-status-warning font-bold">OTHERS</span>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Read (4)</span>
              <input type="checkbox" checked={world.r} onChange={e => setWorld(prev => ({ ...prev, r: e.target.checked }))} className="accent-accent-cyan" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Write (2)</span>
              <input type="checkbox" checked={world.w} onChange={e => setWorld(prev => ({ ...prev, w: e.target.checked }))} className="accent-accent-cyan" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Exec (1)</span>
              <input type="checkbox" checked={world.x} onChange={e => setWorld(prev => ({ ...prev, x: e.target.checked }))} className="accent-accent-cyan" />
            </label>
          </div>
          <span className="text-sm font-bold text-status-warning border-t border-border-subtle/30 pt-2 mt-1">{wOctal}</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-1">
        {isSuccess ? (
          <div className="flex items-center gap-1.5 text-xs text-status-success mr-auto font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Permissions secured.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-status-critical mr-auto font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>Warning: File world-readable!</span>
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          icon={<Terminal className="w-3.5 h-3.5" />}
        >
          EXECUTE CHMOD
        </Button>
      </div>
    </div>
  );
}

import { Badge } from '@/design-system/components/Badge';

/**
 * Maps difficulty labels to badge variant styles.
 * @param {string} diff
 * @returns {'cyan' | 'warning' | 'critical' | 'default'}
 */
function getDifficultyVariant(diff) {
  const normalized = diff.toLowerCase();
  if (normalized === 'easy') return 'cyan';
  if (normalized === 'medium' || normalized === 'intermediate') return 'warning';
  if (normalized === 'advanced') return 'critical';
  return 'default';
}

export default function LabDifficultyBadge({ difficulty }) {
  if (!difficulty) return null;

  if (difficulty.includes('→')) {
    const parts = difficulty.split('→').map((p) => p.trim());
    return (
      <div className="flex items-center gap-1" aria-label={`Difficulty range: ${difficulty}`}>
        <Badge variant={getDifficultyVariant(parts[0])} className="text-[10px] px-2 py-0.5">
          {parts[0]}
        </Badge>
        <span className="text-[10px] font-mono text-text-muted select-none" aria-hidden="true">→</span>
        <Badge variant={getDifficultyVariant(parts[1])} className="text-[10px] px-2 py-0.5">
          {parts[1]}
        </Badge>
      </div>
    );
  }

  return (
    <Badge variant={getDifficultyVariant(difficulty)} className="text-[10px] px-2 py-0.5">
      {difficulty}
    </Badge>
  );
}

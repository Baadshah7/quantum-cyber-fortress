import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { BookOpen } from 'lucide-react';

export default function PlaceholderAcademy() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center text-center py-12 px-4">
      <div className="p-4 bg-accent-violet/10 border border-accent-violet/20 rounded-full text-accent-violet">
        <BookOpen className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight md:text-5xl">
        Academy Chamber
      </h1>
      <p className="text-lg font-ui text-text-secondary max-w-xl leading-relaxed">
        Engage with progressive cybersecurity modules. Study defensive protocols, cryptography principles, and security awareness.
      </p>
      <Card className="p-8 max-w-md w-full flex flex-col gap-4 mt-6">
        <Badge status="coming-soon" className="mx-auto">Zone Status: Coming Soon</Badge>
        <span className="font-mono text-xs text-text-muted">ACADEMY_MODULES_LOCKED</span>
        <div className="h-[1px] bg-border-subtle w-full my-2" />
        <p className="text-sm font-ui text-text-secondary">
          Detailed lessons, theoretical quizzes, and skill-testing questionnaires will be integrated into this chamber during the next development phase.
        </p>
      </Card>
    </div>
  );
}


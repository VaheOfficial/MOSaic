'use client';
import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type Step = { title: string; description?: string; content: ReactNode };
type Props = { steps: Step[]; step: number; setStep: (n: number) => void; onFinish?: () => void };

export default function StepWizard({ steps, step, setStep, onFinish }: Props) {
  const total = steps.length;
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="grid gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-600">Step {step + 1} of {total}</div>
          <div className="text-sm font-medium text-slate-800">{steps[step]?.title}</div>
        </div>
        <div className="h-2 rounded bg-slate-200">
          <div className="h-2 rounded bg-violet-600" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            {steps[step]?.content}
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <Button onClick={() => setStep(Math.max(step - 1, 0))} disabled={step === 0}>Back</Button>
        {step < total - 1 ? (
          <Button onClick={() => setStep(Math.min(step + 1, total - 1))}>Next</Button>
        ) : (
          <Button onClick={onFinish}>Finish</Button>
        )}
      </div>
    </div>
  );
}



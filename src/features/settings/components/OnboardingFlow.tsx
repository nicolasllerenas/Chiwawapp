import { useState } from 'react';
import { db } from '../../../db/db';
import { Button } from '../../../shared/ui/Button';
import { MascotAvatar } from '../../mascot/components/MascotAvatar';

export function OnboardingFlow() {
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState('Chiwi');

  async function finish() {
    await db.settings.update('singleton', {
      mascotName: name.trim() || 'Chiwi',
      onboardingComplete: true,
    });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <MascotAvatar mood="feliz" size={160} />

      {step === 0 && (
        <>
          <div>
            <h1 className="text-2xl font-extrabold text-ink">¡Hola, Chiwawita! Soy tu compañero 🐾</h1>
            <p className="mt-2 text-ink-soft">
              Te voy a ayudar con tus tareas, tu bolso y tus chiwawapuntos. Vamos con calma, a tu
              ritmo.
            </p>
          </div>
          <Button size="lg" onClick={() => setStep(1)} className="w-full max-w-xs">
            Seguir
          </Button>
        </>
      )}

      {step === 1 && (
        <>
          <div className="w-full max-w-xs">
            <h2 className="text-xl font-extrabold text-ink">¿Cómo me llamo?</h2>
            <p className="mt-1 text-sm text-ink-soft">Ponme el nombre que quieras.</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-center text-lg font-bold text-ink outline-none focus:border-primary"
            />
          </div>
          <Button size="lg" onClick={finish} className="w-full max-w-xs">
            Empezar
          </Button>
        </>
      )}
    </div>
  );
}

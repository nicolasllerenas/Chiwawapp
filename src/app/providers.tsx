import { useEffect, useState, type ReactNode } from 'react';
import { seedIfNeeded } from '../db/seed';

export function AppBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfNeeded().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream">
        <p className="text-ink-soft">Cargando Chiwawapp…</p>
      </div>
    );
  }

  return <>{children}</>;
}

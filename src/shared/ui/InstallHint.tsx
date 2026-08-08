import { useEffect, useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { useUiStore } from '../store/uiStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallHint() {
  const dismissed = useUiStore((s) => s.installHintDismissed);
  const dismiss = useUiStore((s) => s.dismissInstallHint);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(true);

  useEffect(() => {
    setStandalone(isStandalone());
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (standalone || dismissed) return null;
  if (!deferredPrompt && !isIOS()) return null;

  return (
    <Card className="mb-4 flex items-start gap-3 bg-surface-soft">
      <span className="text-2xl">📲</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-ink">Instala Chiwawapp en tu pantalla de inicio</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {deferredPrompt
            ? 'Así la abres como una app, con notificaciones y sin barra del navegador.'
            : 'Toca el botón Compartir de Safari y luego "Añadir a pantalla de inicio".'}
        </p>
        {deferredPrompt && (
          <Button
            size="sm"
            className="mt-2"
            onClick={async () => {
              await deferredPrompt.prompt();
              setDeferredPrompt(null);
            }}
          >
            Instalar
          </Button>
        )}
      </div>
      <button type="button" onClick={dismiss} aria-label="Descartar" className="shrink-0 text-ink-faint">
        ✕
      </button>
    </Card>
  );
}

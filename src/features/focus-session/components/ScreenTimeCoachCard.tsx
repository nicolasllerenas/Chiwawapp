import { Card } from '../../../shared/ui/Card';

export function ScreenTimeCoachCard() {
  return (
    <Card className="bg-surface-soft text-sm text-ink-soft">
      <p className="mb-1 font-extrabold text-ink">💡 Tip antes de empezar</p>
      <p>
        Chiwawapp no puede bloquear otras apps (ni TikTok ni Instagram) — eso solo lo puede hacer
        el sistema del celular. Pero puedes activar un <strong>Modo de Concentración</strong> en tu
        iPhone (Ajustes → Modo de concentración → Concentración) antes de darle a "Empezar", y yo te
        acompaño el resto del rato 🐾
      </p>
    </Card>
  );
}

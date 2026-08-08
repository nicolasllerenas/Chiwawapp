import { Card } from '../../../shared/ui/Card';

export function ScreenTimeCoachCard() {
  return (
    <Card className="bg-surface-soft text-sm text-ink-soft">
      <p className="mb-1 font-extrabold text-ink">💡 antes de empezar</p>
      <p>
        no puedo cerrarte TikTok ni Instagram, eso solo lo hace tu celular. pero si activas un{' '}
        <strong>Modo de Concentración</strong> (Ajustes → Modo de concentración) antes de darle a
        "Empezar", yo me quedo aquí acompañándote el resto del rato 🐾
      </p>
    </Card>
  );
}

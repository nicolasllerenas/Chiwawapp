import { usePointsBalance } from '../usePoints';

export function PointsBadge({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const balance = usePointsBalance();

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent/25 font-extrabold text-ink ${
        size === 'lg' ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm'
      }`}
    >
      🐾 {balance.toLocaleString('es-PE')} chiwawapuntos
    </div>
  );
}

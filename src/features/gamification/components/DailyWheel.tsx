import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { todayISODate } from '../../../shared/lib/date';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { WHEEL_SEGMENTS, canSpinToday } from '../wheelEngine';
import { spinWheel } from '../spinRepo';

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;
const SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS.length;
const EXTRA_SPINS = 5;

// Angle measured clockwise from the top (12 o'clock), matching the visual
// spin direction and the CSS `rotate` convention used to animate the wheel.
function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.sin(rad), y: CENTER - radius * Math.cos(rad) };
}

function sliceSVGPath(startAngle: number, endAngle: number): string {
  const start = pointAt(startAngle, RADIUS);
  const end = pointAt(endAngle, RADIUS);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function DailyWheel() {
  const settings = useLiveQuery(() => db.settings.get('singleton'), []);
  const reduceMotion = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  if (!settings) return null;

  const todayISO = todayISODate();
  const available = canSpinToday(settings.lastWheelSpinDate, todayISO);

  async function handleSpin() {
    if (spinning || !available) return;
    setSpinning(true);
    setResult(null);

    const outcome = await spinWheel();
    if (!outcome) {
      setSpinning(false);
      return;
    }

    const targetMidAngle = outcome.segmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const alignAngle = (360 - targetMidAngle) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    let addAngle = EXTRA_SPINS * 360 + alignAngle - currentMod;
    if (addAngle <= 0) addAngle += 360;

    setRotation((r) => r + addAngle);
    window.setTimeout(
      () => {
        setResult(outcome.points);
        setSpinning(false);
      },
      reduceMotion ? 50 : 3200,
    );
  }

  return (
    <Card className="flex flex-col items-center gap-3 bg-surface-soft text-center">
      <p className="font-extrabold text-ink">🎡 Ruleta diaria</p>

      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <div
          className="absolute z-10"
          style={{ left: '50%', top: -4, transform: 'translateX(-50%)' }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '16px solid var(--color-ink)',
            }}
          />
        </div>
        <motion.svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          animate={{ rotate: rotation }}
          transition={reduceMotion ? { duration: 0 } : { duration: 3.2, ease: [0.15, 0.55, 0.2, 1] }}
        >
          {WHEEL_SEGMENTS.map((seg, i) => {
            const start = i * SEGMENT_ANGLE;
            const end = start + SEGMENT_ANGLE;
            const mid = start + SEGMENT_ANGLE / 2;
            const labelPos = pointAt(mid, RADIUS * 0.65);
            return (
              <g key={i}>
                <path d={sliceSVGPath(start, end)} fill={seg.color} stroke="var(--color-surface)" strokeWidth={2} />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={16}
                  fontWeight={800}
                  fill="var(--color-ink)"
                >
                  {seg.points}
                </text>
              </g>
            );
          })}
          <circle cx={CENTER} cy={CENTER} r={16} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={2} />
        </motion.svg>
      </div>

      {result !== null ? (
        <p className="text-sm font-extrabold text-primary">¡ganaste {result} chiwawapuntos! 🎉</p>
      ) : (
        <Button size="sm" onClick={handleSpin} disabled={!available || spinning}>
          {spinning ? 'girando...' : available ? 'girar' : 'vuelve mañana 🐾'}
        </Button>
      )}
    </Card>
  );
}

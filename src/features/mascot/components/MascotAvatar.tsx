import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { MascotMood } from '../moodEngine';

interface MascotAvatarProps {
  mood: MascotMood;
  size?: number;
  interactive?: boolean;
  onPet?: () => void;
}

const EARS_TILT: Record<MascotMood, number> = {
  feliz: 0,
  neutral: 0,
  preocupado: -6,
  triste: 8,
};

function Eyes({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'feliz':
      return (
        <g stroke="#4A3728" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M170 250 Q196 224 222 250" />
          <path d="M290 250 Q316 224 342 250" />
        </g>
      );
    case 'triste':
      return (
        <g>
          <path d="M170 252 A34 30 0 0 1 222 250" fill="#4A3728" />
          <path d="M290 250 A34 30 0 0 1 342 252" fill="#4A3728" />
          <ellipse cx="176" cy="272" rx="6" ry="10" fill="#8AB6A8" opacity="0.85" />
        </g>
      );
    case 'preocupado':
      return (
        <g>
          <circle cx="196" cy="256" r="30" fill="#4A3728" />
          <circle cx="316" cy="256" r="30" fill="#4A3728" />
          <circle cx="186" cy="244" r="8" fill="#FFFFFF" />
          <circle cx="306" cy="244" r="8" fill="#FFFFFF" />
          <path d="M164 214 Q196 202 214 214" stroke="#4A3728" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M298 214 Q316 202 348 214" stroke="#4A3728" strokeWidth="7" fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="196" cy="252" r="36" fill="#4A3728" />
          <circle cx="316" cy="252" r="36" fill="#4A3728" />
          <circle cx="184" cy="238" r="10" fill="#FFFFFF" />
          <circle cx="304" cy="238" r="10" fill="#FFFFFF" />
        </g>
      );
  }
}

function Mouth({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'feliz':
      return (
        <g>
          <path d="M210 328 Q256 366 302 328" stroke="#4A3728" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M240 348 Q256 360 272 348 L268 366 Q256 374 244 366 Z" fill="#F6B8B0" />
        </g>
      );
    case 'triste':
      return <path d="M224 340 Q256 320 288 340" stroke="#4A3728" strokeWidth="8" fill="none" strokeLinecap="round" />;
    case 'preocupado':
      return <ellipse cx="256" cy="332" rx="12" ry="9" fill="#4A3728" />;
    default:
      return <path d="M230 330 Q256 344 282 330" stroke="#4A3728" strokeWidth="7" fill="none" strokeLinecap="round" />;
  }
}

const HEART_OFFSETS = [
  { x: -34, delay: 0 },
  { x: -10, delay: 0.08 },
  { x: 14, delay: 0.03 },
  { x: 36, delay: 0.12 },
];

export function MascotAvatar({ mood, size = 160, interactive = false, onPet }: MascotAvatarProps) {
  const reduceMotion = useReducedMotion();
  const [petBurst, setPetBurst] = useState(0);
  const [petting, setPetting] = useState(false);

  function handlePet() {
    if (!interactive) return;
    setPetBurst((n) => n + 1);
    setPetting(true);
    window.setTimeout(() => setPetting(false), 260);
    onPet?.();
  }

  return (
    <div className="relative inline-flex" style={{ width: size, height: (size * 400) / 512 }}>
      <motion.svg
        viewBox="0 0 512 400"
        width={size}
        height={(size * 400) / 512}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? 'Acariciar a tu mascota' : undefined}
        onClick={handlePet}
        style={{ cursor: interactive ? 'pointer' : undefined }}
        animate={
          reduceMotion
            ? undefined
            : petting
              ? { y: [0, -14, 0], scale: [1, 1.08, 1] }
              : { y: [0, -6, 0] }
        }
        transition={
          petting ? { duration: 0.35, ease: 'easeOut' } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <motion.g
          animate={
            reduceMotion
              ? { rotate: EARS_TILT[mood] }
              : { rotate: [EARS_TILT[mood], EARS_TILT[mood] - 4, EARS_TILT[mood]] }
          }
          transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '160px 90px' }}
        >
          <path d="M158 168 L118 72 C114 62 124 52 134 57 L206 96 Z" fill="#C2823D" />
          <path d="M172 176 L138 96 C135 89 141 82 148 85 L204 112 Z" fill="#E9A55C" />
        </motion.g>
        <motion.g
          animate={reduceMotion ? { rotate: -EARS_TILT[mood] } : { rotate: [-EARS_TILT[mood], -EARS_TILT[mood] + 4, -EARS_TILT[mood]] }}
          transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          style={{ transformOrigin: '352px 90px' }}
        >
          <path d="M354 168 L394 72 C398 62 388 52 378 57 L306 96 Z" fill="#C2823D" />
          <path d="M340 176 L374 96 C377 89 371 82 364 85 L308 112 Z" fill="#E9A55C" />
        </motion.g>

        <circle cx="256" cy="266" r="140" fill="#F1B37E" />
        <ellipse cx="256" cy="330" rx="70" ry="54" fill="#FBE0BE" />

        <ellipse cx="164" cy="296" rx="20" ry="12" fill="#F6B8B0" opacity="0.7" />
        <ellipse cx="348" cy="296" rx="20" ry="12" fill="#F6B8B0" opacity="0.7" />

        <motion.g
          animate={reduceMotion ? undefined : { scaleY: [1, 1, 1, 0.08, 1, 1, 1, 1] }}
          transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, times: [0, 0.42, 0.46, 0.5, 0.54, 0.58, 0.8, 1], ease: 'easeInOut' }}
          style={{ transformOrigin: '256px 250px' }}
        >
          <Eyes mood={mood} />
        </motion.g>
        <ellipse cx="256" cy="304" rx="16" ry="12" fill="#4A3728" />
        <path d="M256 314 Q256 328 244 332" stroke="#4A3728" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M256 314 Q256 328 268 332" stroke="#4A3728" strokeWidth="5" fill="none" strokeLinecap="round" />
        <Mouth mood={mood} />
      </motion.svg>

      <AnimatePresence>
        {interactive && petBurst > 0 && (
          <motion.div key={petBurst} className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
            {HEART_OFFSETS.map((h, i) => (
              <motion.span
                key={i}
                className="absolute text-lg"
                style={{ left: '50%' }}
                initial={{ opacity: 0, x: h.x, y: 20, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -50, scale: 1 }}
                transition={{ duration: 0.9, delay: h.delay, ease: 'easeOut' }}
              >
                💛
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

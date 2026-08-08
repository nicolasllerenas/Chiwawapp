import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { MascotAvatar } from './MascotAvatar';
import { moodMessage } from '../messages';
import { useMascot } from '../useMascot';

const PET_MESSAGES = ['eso, cariños 🥹', 'guau guau 🐾', 'qué rico, más', 'me encanta esto', 'jeje otra vez'];

export function MascotCard() {
  const { mood, streak, mascotName, userName, loading } = useMascot();
  const message = useMemo(() => moodMessage(mood, userName), [mood, userName]);
  const [petMessage, setPetMessage] = useState<string | null>(null);

  if (loading) return null;

  function handlePet() {
    setPetMessage(PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)]);
    window.setTimeout(() => setPetMessage(null), 1600);
  }

  return (
    <Card className="flex items-center gap-3 bg-surface-soft">
      <MascotAvatar mood={mood} size={92} interactive onPet={handlePet} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-ink">{mascotName}</p>
        <motion.p
          key={petMessage ?? message}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-ink-soft"
        >
          {petMessage ?? message}
        </motion.p>
        {streak > 0 && (
          <p className="mt-1 text-xs font-bold text-primary">
            🔥 {streak} {streak === 1 ? 'día seguido' : 'días seguidos'}
          </p>
        )}
      </div>
    </Card>
  );
}

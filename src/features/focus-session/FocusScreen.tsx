import { useEffect, useState } from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { ProgressRing } from '../../shared/ui/ProgressRing';
import { MascotAvatar } from '../mascot/components/MascotAvatar';
import { focusSessionDoneMessage } from '../mascot/messages';
import { useMascot } from '../mascot/useMascot';
import { FOCUS_SESSION_POINTS } from '../gamification/pointsEngine';
import { ScreenTimeCoachCard } from './components/ScreenTimeCoachCard';
import { startFocusSession, completeFocusSession, cancelFocusSession } from './focusRepo';

const DURATIONS = [15, 25, 45];

export function FocusScreen() {
  const { userName } = useMascot();
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');

  const running = sessionId !== null && !done;

  // Ticking and completion live in one effect: computing "done" from a
  // separate effect keyed on remainingMs raced against this one, since
  // remainingMs was still its stale 0 initial value on the very render
  // where `running` first flipped true — that fired completion instantly.
  useEffect(() => {
    if (!running || endAt === null) return;
    let intervalId: ReturnType<typeof setInterval>;
    const tick = () => {
      const remaining = Math.max(0, endAt - Date.now());
      setRemainingMs(remaining);
      if (remaining === 0) {
        clearInterval(intervalId);
        completeFocusSession(sessionId!);
        setMessage(focusSessionDoneMessage(userName));
        setDone(true);
      }
    };
    tick();
    intervalId = setInterval(tick, 250);
    return () => clearInterval(intervalId);
  }, [running, endAt, sessionId, userName]);

  async function handleStart() {
    const id = await startFocusSession(durationMinutes);
    setSessionId(id);
    setRemainingMs(durationMinutes * 60_000);
    setEndAt(Date.now() + durationMinutes * 60_000);
    setDone(false);
  }

  async function handleCancel() {
    if (sessionId) await cancelFocusSession(sessionId);
    resetState();
  }

  function resetState() {
    setSessionId(null);
    setEndAt(null);
    setRemainingMs(0);
    setDone(false);
  }

  const totalMs = durationMinutes * 60_000;
  const progress = totalMs ? 1 - remainingMs / totalMs : 0;
  const mm = String(Math.floor(remainingMs / 60_000)).padStart(2, '0');
  const ss = String(Math.floor((remainingMs % 60_000) / 1000)).padStart(2, '0');

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold text-ink">Sesión de Enfoque</h1>

      {!running && !done && (
        <>
          <ScreenTimeCoachCard />
          <Card>
            <p className="mb-2 text-sm font-bold text-ink-soft">¿Cuánto rato?</p>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationMinutes(d)}
                  className={`flex-1 rounded-2xl border py-2.5 text-sm font-bold ${
                    durationMinutes === d ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-ink-soft'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <Button onClick={handleStart} className="mt-4 w-full" size="lg">
              Empezar
            </Button>
          </Card>
        </>
      )}

      {running && (
        <Card className="flex flex-col items-center gap-4 bg-surface-soft py-8">
          <MascotAvatar mood="neutral" size={110} />
          <ProgressRing progress={progress} size={140} strokeWidth={10}>
            <span className="text-2xl font-extrabold text-ink">
              {mm}:{ss}
            </span>
          </ProgressRing>
          <p className="text-sm text-ink-soft">Aquí estoy, acompañándote 🐾</p>
          <Button variant="ghost" onClick={handleCancel}>
            Terminar antes
          </Button>
        </Card>
      )}

      <Modal open={done} onClose={resetState}>
        <div className="flex flex-col items-center gap-3 text-center">
          <MascotAvatar mood="feliz" size={120} interactive />
          <p className="text-lg font-extrabold text-ink">{message}</p>
          <p className="text-sm text-ink-soft">+{FOCUS_SESSION_POINTS} chiwawapuntos</p>
          <Button onClick={resetState} className="w-full">
            Genial
          </Button>
        </div>
      </Modal>
    </div>
  );
}

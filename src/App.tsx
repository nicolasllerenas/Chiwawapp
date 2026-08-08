import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { useUiStore } from './shared/store/uiStore';
import { BottomNav } from './shared/ui/BottomNav';
import { Modal } from './shared/ui/Modal';
import { InstallHint } from './shared/ui/InstallHint';
import { HomeScreen } from './features/home/HomeScreen';
import { TasksScreen } from './features/tasks/TasksScreen';
import { BagcheckScreen } from './features/bagcheck/BagcheckScreen';
import { FocusScreen } from './features/focus-session/FocusScreen';
import { RewardsScreen } from './features/gamification/RewardsScreen';
import { MusicScreen } from './features/music/MusicScreen';
import { ReminderBanner } from './features/notifications/components/ReminderBanner';
import { OnboardingFlow } from './features/settings/components/OnboardingFlow';
import { SettingsScreen } from './features/settings/components/SettingsScreen';

function App() {
  const activeTab = useUiStore((s) => s.activeTab);
  const activeModal = useUiStore((s) => s.activeModal);
  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);

  const settings = useLiveQuery(() => db.settings.get('singleton'), []);

  if (settings && !settings.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <header className="safe-top sticky top-0 z-30 flex items-center justify-between bg-cream/95 px-4 py-3 backdrop-blur">
        <p className="text-lg font-extrabold text-ink">🐶 Chiwawapp</p>
        <button
          type="button"
          onClick={() => openModal('settings')}
          aria-label="Ajustes"
          className="rounded-full p-2 text-ink-faint active:bg-surface-soft"
        >
          ⚙️
        </button>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-4">
        <InstallHint />
        <ReminderBanner />
        {activeTab === 'inicio' && <HomeScreen />}
        {activeTab === 'tareas' && <TasksScreen />}
        {activeTab === 'bolso' && <BagcheckScreen />}
        {activeTab === 'enfoque' && <FocusScreen />}
        {activeTab === 'recompensas' && <RewardsScreen />}
        {activeTab === 'musica' && <MusicScreen />}
      </main>
      <BottomNav />

      <Modal open={activeModal === 'settings'} onClose={closeModal}>
        <SettingsScreen />
      </Modal>
    </div>
  );
}

export default App;

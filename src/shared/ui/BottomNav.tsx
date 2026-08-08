import { useUiStore, type TabId } from '../store/uiStore';

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'inicio', label: 'Inicio', emoji: '🏠' },
  { id: 'tareas', label: 'Tareas', emoji: '✅' },
  { id: 'bolso', label: 'Bolso', emoji: '🎒' },
  { id: 'enfoque', label: 'Enfoque', emoji: '🎯' },
  { id: 'recompensas', label: 'Premios', emoji: '🎁' },
  { id: 'musica', label: 'Música', emoji: '🎵' },
];

export function BottomNav() {
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  return (
    <nav className="safe-bottom sticky bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <ul className="mx-auto flex max-w-lg justify-between px-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors ${
                  isActive ? 'text-primary' : 'text-ink-faint'
                }`}
              >
                <span className={`text-xl leading-none transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {tab.emoji}
                </span>
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

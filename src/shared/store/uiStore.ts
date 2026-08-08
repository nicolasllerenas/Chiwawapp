import { create } from 'zustand';

export type TabId = 'inicio' | 'tareas' | 'bolso' | 'enfoque' | 'recompensas' | 'musica';

interface UiState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  installHintDismissed: boolean;
  dismissInstallHint: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: 'inicio',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  installHintDismissed: false,
  dismissInstallHint: () => set({ installHintDismissed: true }),
}));

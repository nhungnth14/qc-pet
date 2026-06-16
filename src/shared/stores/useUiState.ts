import { create } from 'zustand';

type UiState = {
  activePanelId: string | null;
  toastMessage: string | null;
  isLoading: boolean;
  openPanel: (panelId: string) => void;
  closePanel: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  setLoading: (loading: boolean) => void;
};

export const useUiState = create<UiState>()((set) => ({
  activePanelId: null,
  toastMessage: null,
  isLoading: false,
  openPanel: (panelId) => set({ activePanelId: panelId }),
  closePanel: () => set({ activePanelId: null }),
  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));

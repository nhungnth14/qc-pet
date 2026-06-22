import { create } from 'zustand';

// Connectivity store (Story 4-3). Không có NetInfo → `online` suy ra từ kết quả call server gần nhất
// (syncNeedBars / careAction). Mặc định true (optimistic). Care + Core Mission disable khi offline.

type ConnectivityState = {
  online: boolean;
  setOnline: (online: boolean) => void;
};

export const useConnectivity = create<ConnectivityState>(set => ({
  online: true,
  setOnline: online => set({ online }),
}));

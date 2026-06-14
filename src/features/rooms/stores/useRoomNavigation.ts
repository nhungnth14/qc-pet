import { create } from 'zustand';

export type RoomType =
  | 'WORK_ROOM'
  | 'KITCHEN'
  | 'BEDROOM'
  | 'LIVING_ROOM'
  | 'BATHROOM'
  | 'GARDEN';

type RoomNavigationState = {
  currentRoom: RoomType;
  isTransitioning: boolean;
  apartmentViewOpen: boolean;
  setCurrentRoom: (room: RoomType) => void;
  setTransitioning: (transitioning: boolean) => void;
  openApartmentView: () => void;
  closeApartmentView: () => void;
};

export const useRoomNavigation = create<RoomNavigationState>()((set) => ({
  currentRoom: 'WORK_ROOM',
  isTransitioning: false,
  apartmentViewOpen: false,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  openApartmentView: () => set({ apartmentViewOpen: true }),
  closeApartmentView: () => set({ apartmentViewOpen: false }),
}));

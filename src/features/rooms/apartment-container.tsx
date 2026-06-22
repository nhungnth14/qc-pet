import type { RoomType } from './stores/use-room-navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GoodMorningMoment } from '@/features/pet/components/good-morning-moment';
import { WeekendBanner } from '@/features/pet/components/weekend-banner';
import { useNeedBarDecay } from '@/features/pet/use-need-bar-decay';
import { useSprintStore } from '@/features/sprint/stores/use-sprint-store';
import { WorkRoomScreen } from '@/features/work-room/work-room-screen';
import { getAdjacentRoom } from './apartment-layout';
import { ApartmentView } from './components/apartment-view';
import { RoomScreen } from './components/room-screen';
import { WALK_DURATION_MS, WalkTransition } from './components/walk-transition';
import { useRoomNavigation } from './stores/use-room-navigation';
import { useRoomStore } from './stores/use-room-store';
import { useRoomUnlock } from './use-room-unlock';

const SWIPE_THRESHOLD = 60;

/**
 * Apartment shell (Story 3-2): render phòng hiện tại trong Immersive Mode + xử lý điều hướng
 * (swipe trái/phải, 🏠 FAB → Apartment View, walk transition overlay). Là default export của
 * route `src/app/(app)/index.tsx`. WorkRoomScreen = nội dung WORK_ROOM; phòng khác → RoomScreen.
 */
export function ApartmentContainer() {
  const currentRoom = useRoomNavigation(s => s.currentRoom);
  const apartmentViewOpen = useRoomNavigation(s => s.apartmentViewOpen);
  const isTransitioning = useRoomNavigation(s => s.isTransitioning);
  const openApartmentView = useRoomNavigation(s => s.openApartmentView);
  const closeApartmentView = useRoomNavigation(s => s.closeApartmentView);
  const setCurrentRoom = useRoomNavigation(s => s.setCurrentRoom);
  const setTransitioning = useRoomNavigation(s => s.setTransitioning);

  const rooms = useRoomStore(s => s.rooms);
  const loadRooms = useRoomStore(s => s.loadFromLocal);
  const loadSprint = useSprintStore(s => s.loadFromLocal);
  const recordActivity = useSprintStore(s => s.recordActivity);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Story 4-1: real-time need-bar decay (server sync on mount/foreground + 60s client tick).
  useNeedBarDecay();
  // Story 3-4: room unlock engine (trigger eval → cửa hé mở + notice).
  const { unlockMessage, dismissUnlock } = useRoomUnlock();

  useEffect(() => {
    loadRooms();
    loadSprint();
    recordActivity(); // Story 7.4: cập nhật streak (consecutive-day) khi mở app
    return () => {
      if (timerRef.current)
        clearTimeout(timerRef.current);
      setTransitioning(false);
    };
  }, [loadRooms, loadSprint, recordActivity, setTransitioning]);

  const unlockedCount = useMemo(
    () => Object.values(rooms).filter(r => r.isUnlocked).length,
    [rooms],
  );

  const isUnlocked = useCallback((room: RoomType) => rooms[room]?.isUnlocked ?? false, [rooms]);

  const navigateToRoom = useCallback((target: RoomType) => {
    closeApartmentView();
    if (target === currentRoom)
      return;
    setTransitioning(true);
    setCurrentRoom(target);
    if (timerRef.current)
      clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTransitioning(false), WALK_DURATION_MS);
  }, [currentRoom, closeApartmentView, setCurrentRoom, setTransitioning]);

  const swipe = useMemo(
    () => Gesture.Pan()
      .activeOffsetX([-20, 20])
      .runOnJS(true)
      .onEnd((e) => {
        if (Math.abs(e.translationX) < SWIPE_THRESHOLD)
          return;
        const direction = e.translationX < 0 ? 'next' : 'prev';
        const target = getAdjacentRoom(currentRoom, direction, isUnlocked);
        if (target !== null)
          navigateToRoom(target);
      }),
    [currentRoom, isUnlocked, navigateToRoom],
  );

  return (
    <View style={styles.root}>
      <GestureDetector gesture={swipe}>
        <View style={styles.room}>
          {currentRoom === 'WORK_ROOM'
            ? <WorkRoomScreen />
            : <RoomScreen roomType={currentRoom} />}
        </View>
      </GestureDetector>

      {!apartmentViewOpen && <WeekendBanner />}
      {!apartmentViewOpen && <GoodMorningMoment />}

      {!apartmentViewOpen && unlockMessage !== null && (
        <Pressable
          style={styles.unlockBanner}
          onPress={dismissUnlock}
          accessibilityRole="button"
          accessibilityLabel="Đóng thông báo mở khóa phòng"
        >
          <Text style={styles.unlockText}>{unlockMessage}</Text>
        </Pressable>
      )}

      {unlockedCount >= 2 && !apartmentViewOpen && !isTransitioning && (
        <Pressable
          style={styles.homeFab}
          onPress={openApartmentView}
          accessibilityRole="button"
          accessibilityLabel="Mở Apartment View"
        >
          <Text style={styles.homeFabIcon}>🏠</Text>
        </Pressable>
      )}

      {apartmentViewOpen && (
        <ApartmentView onClose={closeApartmentView} onSelectRoom={navigateToRoom} />
      )}

      {isTransitioning && <WalkTransition />}
    </View>
  );
}

export default ApartmentContainer;

const styles = StyleSheet.create({
  root: { flex: 1 },
  room: { flex: 1 },
  homeFab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#001a41',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    zIndex: 40,
  },
  homeFabIcon: { fontSize: 26 },
  unlockBanner: {
    position: 'absolute',
    top: 160,
    left: 16,
    right: 16,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFE082',
    borderWidth: 2,
    borderColor: '#001a41',
    zIndex: 36,
  },
  unlockText: { fontSize: 14, fontWeight: '800', color: '#001a41', textAlign: 'center' },
});

import type { RoomType } from '../stores/use-room-navigation';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useBugsyAnimation } from '@/features/pet/use-bugsy-animation';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { getEmergencyRoom, getRoomVisualState, getUnlockHint, ROOM_GRID, ROOM_ORDER } from '../apartment-layout';
import { ROOM_DEFINITIONS } from '../room-types';
import { upsertRoomState } from '../rooms-api';
import { useRoomStore } from '../stores/use-room-store';
import { RoomEnvironment } from './room-environment';

type ApartmentViewProps = {
  onClose: () => void;
  onSelectRoom: (room: RoomType) => void;
};

// 2×3 grid rows dẫn xuất từ ROOM_GRID (single source of truth) — UX-DR7 L-shape.
const GRID_ROWS: RoomType[][] = [0, 1].map(row =>
  ROOM_ORDER.filter(r => ROOM_GRID[r].row === row).sort((a, b) => ROOM_GRID[a].col - ROOM_GRID[b].col),
);

/** Apartment View overlay — isometric-style 2×3 grid (Story 3-2 + 3-4 two-stage unlock). */
export function ApartmentView({ onClose, onSelectRoom }: ApartmentViewProps) {
  const rooms = useRoomStore(s => s.rooms);
  const setUnlocked = useRoomStore(s => s.setUnlocked);
  const needBars = usePetStore(s => s.needBars);
  const userId = useSessionStore(s => s.userId);
  const celebrate = useBugsyAnimation(s => s.celebrate);
  const [lockedTip, setLockedTip] = useState<string | null>(null);

  const isUnlocked = (room: RoomType) => rooms[room]?.isUnlocked ?? false;
  const emergencyRoom = getEmergencyRoom(needBars, isUnlocked);

  const handleTile = (room: RoomType) => {
    const rs = rooms[room];
    if (rs?.isUnlocked) {
      onSelectRoom(room);
      return;
    }
    // Story 3-4: cửa hé mở (trigger met) → lần đầu vào = unlock + Bugsy excited.
    if (rs?.unlockTriggerMet) {
      setUnlocked(room, true);
      celebrate();
      if (userId)
        void upsertRoomState(userId, room, { isUnlocked: true }).catch(() => {});
      onSelectRoom(room);
      return;
    }
    setLockedTip(`${ROOM_DEFINITIONS[room].label}: ${getUnlockHint(ROOM_DEFINITIONS[room].unlockTrigger)}`);
  };

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Căn hộ của Bugsy</Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Đóng Apartment View"
          style={styles.close}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {GRID_ROWS.map(rowRooms => (
          <View key={rowRooms.join('-')} style={styles.gridRow}>
            {rowRooms.map((room) => {
              const def = ROOM_DEFINITIONS[room];
              const rs = rooms[room];
              const ajar = !rs?.isUnlocked && (rs?.unlockTriggerMet ?? false);
              const envState = rs?.isUnlocked
                ? getRoomVisualState(room, isUnlocked, needBars)
                : ajar ? 'normal' : 'locked';
              return (
                <Pressable
                  key={room}
                  style={styles.tileWrap}
                  onPress={() => handleTile(room)}
                  accessibilityRole="button"
                  accessibilityLabel={`${def.label} — ${ajar ? 'cửa hé mở' : envState}`}
                >
                  <RoomEnvironment roomType={room} state={envState}>
                    <View style={styles.tileContent}>
                      <Text style={styles.tileEmoji}>{def.emoji}</Text>
                      <Text style={styles.tileLabel}>{def.label}</Text>
                    </View>
                  </RoomEnvironment>
                  {ajar && (
                    <View style={styles.ajarChip}>
                      <Text style={styles.ajarText}>🚪</Text>
                    </View>
                  )}
                  {emergencyRoom === room && (
                    <View style={styles.fireChip}>
                      <Text style={styles.fireText}>🔥</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {lockedTip !== null && (
        <View style={styles.tip}>
          <Text style={styles.tipText}>{`🔒 Mở khóa — ${lockedTip}`}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#001a41',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#fff' },
  close: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  closeText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  grid: { gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  tileWrap: { flex: 1, aspectRatio: 1 },
  tileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tileEmoji: { fontSize: 36 },
  tileLabel: { fontSize: 12, fontWeight: '800', color: '#001a41', textAlign: 'center' },
  ajarChip: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE082',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  ajarText: { fontSize: 16 },
  fireChip: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  fireText: { fontSize: 16 },
  tip: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
  },
  tipText: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center' },
});

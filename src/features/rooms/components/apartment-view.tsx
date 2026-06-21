import type { RoomType } from '../stores/use-room-navigation';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePetStore } from '@/stores/pet-store';
import { getEmergencyRoom, getRoomVisualState, getUnlockHint, ROOM_GRID, ROOM_ORDER } from '../apartment-layout';
import { ROOM_DEFINITIONS } from '../room-types';
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

/** Apartment View overlay — isometric-style 2×3 grid (Story 3-2 AC-2). */
export function ApartmentView({ onClose, onSelectRoom }: ApartmentViewProps) {
  const rooms = useRoomStore(s => s.rooms);
  const needBars = usePetStore(s => s.needBars);
  const [lockedTip, setLockedTip] = useState<string | null>(null);

  const isUnlocked = (room: RoomType) => rooms[room]?.isUnlocked ?? false;
  const emergencyRoom = getEmergencyRoom(needBars, isUnlocked);

  const handleTile = (room: RoomType) => {
    if (isUnlocked(room)) {
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
              const state = getRoomVisualState(room, isUnlocked, needBars);
              return (
                <Pressable
                  key={room}
                  style={styles.tileWrap}
                  onPress={() => handleTile(room)}
                  accessibilityRole="button"
                  accessibilityLabel={`${def.label} — ${state}`}
                >
                  <RoomEnvironment roomType={room} state={state}>
                    <View style={styles.tileContent}>
                      <Text style={styles.tileEmoji}>{def.emoji}</Text>
                      <Text style={styles.tileLabel}>{def.label}</Text>
                    </View>
                  </RoomEnvironment>
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

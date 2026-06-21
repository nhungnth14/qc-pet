import type { RoomType } from './stores/use-room-navigation';
import { useCallback, useState } from 'react';
import { usePetStore } from '@/stores/pet-store';
import { buildSuggestionMessage, getMostNeededRoom } from './apartment-layout';
import { ROOM_DEFINITIONS } from './room-types';
import { useRoomStore } from './stores/use-room-store';

export type RoomSuggestion = {
  room: RoomType;
  message: string;
};

/**
 * Tính gợi ý phòng cần nhất (long-press Bugsy). Đọc needBars + tên pet (pet-store) và
 * unlock state (room-store), trả message + control hiện/ẩn bubble.
 */
export function useRoomSuggestion() {
  const rooms = useRoomStore(s => s.rooms);
  const needBars = usePetStore(s => s.needBars);
  const petName = usePetStore(s => s.name);
  const [suggestion, setSuggestion] = useState<RoomSuggestion | null>(null);

  const suggest = useCallback(() => {
    const isUnlocked = (room: RoomType) => rooms[room]?.isUnlocked ?? false;
    const { room, need } = getMostNeededRoom(needBars, isUnlocked);
    setSuggestion({ room, message: buildSuggestionMessage(need, petName, ROOM_DEFINITIONS[room].label) });
  }, [rooms, needBars, petName]);

  const dismiss = useCallback(() => setSuggestion(null), []);

  return { suggestion, suggest, dismiss };
}

import type { NeedBars } from './apartment-layout';
import type { RoomType } from './stores/use-room-navigation';
import {
  buildSuggestionMessage,
  getAdjacentRoom,
  getEmergencyRoom,
  getMostNeededRoom,
  getRoomVisualState,
  ROOM_GRID,
  ROOM_ORDER,
} from './apartment-layout';

const FULL_BARS: NeedBars = { hunger: 80, happiness: 80, health: 80, discipline: 80 };

// Mặc định: chỉ WORK_ROOM unlocked (giống initial state useRoomStore).
function onlyWork(room: RoomType): boolean {
  return room === 'WORK_ROOM';
}

function unlockedSet(...rooms: RoomType[]): (room: RoomType) => boolean {
  const set = new Set(rooms);
  return (room: RoomType) => set.has(room);
}

describe('room order + grid', () => {
  it('có đủ 6 phòng trong ROOM_ORDER, không trùng', () => {
    expect(ROOM_ORDER).toHaveLength(6);
    expect(new Set(ROOM_ORDER).size).toBe(6);
  });

  it('có 6 vị trí duy nhất trong ROOM_GRID (2×3)', () => {
    const positions = Object.values(ROOM_GRID).map(p => `${p.row}-${p.col}`);
    expect(positions).toHaveLength(6);
    expect(new Set(positions).size).toBe(6);
    expect(Object.values(ROOM_GRID).every(p => p.row <= 1 && p.col <= 2)).toBe(true);
  });
});

describe('getAdjacentRoom', () => {
  const allUnlocked = (): boolean => true;

  it('next/prev khi tất cả unlocked', () => {
    expect(getAdjacentRoom('WORK_ROOM', 'next', allUnlocked)).toBe('KITCHEN');
    expect(getAdjacentRoom('KITCHEN', 'prev', allUnlocked)).toBe('WORK_ROOM');
    expect(getAdjacentRoom('BEDROOM', 'next', allUnlocked)).toBe('LIVING_ROOM');
  });

  it('skip phòng locked, đi tới phòng unlocked gần nhất', () => {
    // KITCHEN locked → từ WORK_ROOM next nhảy tới BEDROOM
    const unlocked = unlockedSet('WORK_ROOM', 'BEDROOM', 'GARDEN');
    expect(getAdjacentRoom('WORK_ROOM', 'next', unlocked)).toBe('BEDROOM');
    expect(getAdjacentRoom('BEDROOM', 'next', unlocked)).toBe('GARDEN');
  });

  it('null khi không còn phòng unlocked theo hướng', () => {
    expect(getAdjacentRoom('WORK_ROOM', 'prev', onlyWork)).toBeNull();
    expect(getAdjacentRoom('WORK_ROOM', 'next', onlyWork)).toBeNull();
    expect(getAdjacentRoom('GARDEN', 'next', () => true)).toBeNull();
  });
});

describe('getMostNeededRoom', () => {
  it('chọn need bar thấp nhất khi mọi phòng unlocked', () => {
    const bars: NeedBars = { hunger: 20, happiness: 90, health: 70, discipline: 60 };
    const result = getMostNeededRoom(bars, () => true);
    expect(result.need).toBe('hunger');
    expect(result.room).toBe('KITCHEN');
  });

  it('bỏ qua phòng locked, chọn need thấp nhất trong phòng unlocked', () => {
    // hunger thấp nhất nhưng KITCHEN locked → chọn discipline/WORK_ROOM (unlocked)
    const bars: NeedBars = { hunger: 10, happiness: 90, health: 90, discipline: 40 };
    const result = getMostNeededRoom(bars, onlyWork);
    expect(result.room).toBe('WORK_ROOM');
    expect(result.need).toBe('discipline');
  });
});

describe('getRoomVisualState', () => {
  it('locked khi phòng chưa unlock', () => {
    expect(getRoomVisualState('KITCHEN', onlyWork, FULL_BARS)).toBe('locked');
  });

  it('attention khi unlocked + need bar mapped < 50', () => {
    const bars: NeedBars = { ...FULL_BARS, hunger: 40 };
    expect(getRoomVisualState('KITCHEN', () => true, bars)).toBe('attention');
  });

  it('normal khi unlocked + bar đủ cao', () => {
    expect(getRoomVisualState('KITCHEN', () => true, FULL_BARS)).toBe('normal');
  });

  it('normal cho phòng không gắn need bar (BATHROOM/GARDEN)', () => {
    expect(getRoomVisualState('GARDEN', () => true, { ...FULL_BARS, hunger: 0 })).toBe('normal');
  });
});

describe('getEmergencyRoom', () => {
  it('trả phòng bar thấp nhất (≠ Work Room) khi < 50', () => {
    const bars: NeedBars = { ...FULL_BARS, happiness: 15 };
    expect(getEmergencyRoom(bars, () => true)).toBe('LIVING_ROOM');
  });

  it('loại Work Room: discipline thấp nhất nhưng không trả WORK_ROOM', () => {
    // discipline 5 (Work Room) thấp nhất nhưng bị loại; hunger 40 → KITCHEN
    const bars: NeedBars = { hunger: 40, happiness: 90, health: 90, discipline: 5 };
    expect(getEmergencyRoom(bars, () => true)).toBe('KITCHEN');
  });

  it('null khi mọi bar (≠ Work Room) ≥ 50', () => {
    expect(getEmergencyRoom({ ...FULL_BARS, hunger: 55, discipline: 5 }, () => true)).toBeNull();
  });

  it('bỏ qua phòng locked', () => {
    // happiness thấp nhất nhưng LIVING_ROOM locked → KITCHEN (hunger 45 < 50)
    const bars: NeedBars = { ...FULL_BARS, happiness: 10, hunger: 45 };
    const unlocked = unlockedSet('WORK_ROOM', 'KITCHEN');
    expect(getEmergencyRoom(bars, unlocked)).toBe('KITCHEN');
  });
});

describe('buildSuggestionMessage', () => {
  it('đúng format với feeling + label + tên', () => {
    expect(buildSuggestionMessage('hunger', 'Bugsy', 'Bếp')).toBe('Mình đói rồi, vào Bếp nha Bugsy!');
    expect(buildSuggestionMessage('happiness', 'Bún', 'Phòng Khách')).toBe(
      'Mình buồn rồi, vào Phòng Khách nha Bún!',
    );
  });
});

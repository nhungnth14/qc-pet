import { ALL_ROOM_TYPES, ROOM_DEFINITIONS } from './room-types';
import { useRoomStore } from './stores/use-room-store';

const mockStorage = new Map<string, unknown>();

jest.mock('@/shared/lib/storage', () => ({
  storage: {
    getItem: (k: string) => mockStorage.get(k) ?? null,
    setItem: (k: string, v: unknown) => { mockStorage.set(k, v); },
  },
}));

const RESET_ROOMS = {
  WORK_ROOM: { isUnlocked: true, unlockTriggerMet: true },
  KITCHEN: { isUnlocked: false, unlockTriggerMet: false },
  BEDROOM: { isUnlocked: false, unlockTriggerMet: false },
  LIVING_ROOM: { isUnlocked: false, unlockTriggerMet: false },
  BATHROOM: { isUnlocked: false, unlockTriggerMet: false },
  GARDEN: { isUnlocked: false, unlockTriggerMet: false },
};

afterEach(() => {
  mockStorage.clear();
  useRoomStore.setState({ rooms: { ...RESET_ROOMS } });
});

describe('room definitions', () => {
  it('có đủ 6 phòng', () => {
    expect(ALL_ROOM_TYPES).toHaveLength(6);
  });

  it('mỗi phòng có đủ 4 fields bắt buộc', () => {
    for (const roomType of ALL_ROOM_TYPES) {
      const def = ROOM_DEFINITIONS[roomType];
      expect(def).toHaveProperty('label');
      expect(def).toHaveProperty('emoji');
      expect(def).toHaveProperty('bgColor');
      expect(def).toHaveProperty('unlockTrigger');
      expect(def.label.length).toBeGreaterThan(0);
      expect(def.emoji.length).toBeGreaterThan(0);
    }
  });

  it('work room dùng warm-peach-bg #FFE5D9', () => {
    expect(ROOM_DEFINITIONS.WORK_ROOM.bgColor).toBe('#FFE5D9');
  });

  it('work room unlock trigger là onboarding', () => {
    expect(ROOM_DEFINITIONS.WORK_ROOM.unlockTrigger).toBe('onboarding');
  });
});

describe('useRoomStore', () => {
  it('initial state: Work Room unlocked, các phòng khác locked', () => {
    const { rooms } = useRoomStore.getState();
    expect(rooms.WORK_ROOM.isUnlocked).toBe(true);
    expect(rooms.KITCHEN.isUnlocked).toBe(false);
    expect(rooms.BEDROOM.isUnlocked).toBe(false);
    expect(rooms.GARDEN.isUnlocked).toBe(false);
  });

  it('setUnlocked(KITCHEN) → KITCHEN unlocked, Work Room vẫn unlocked', () => {
    const { rooms: before } = useRoomStore.getState();
    expect(before.WORK_ROOM.isUnlocked).toBe(true);
    useRoomStore.getState().setUnlocked('KITCHEN');
    const { rooms } = useRoomStore.getState();
    expect(rooms.KITCHEN.isUnlocked).toBe(true);
    expect(rooms.WORK_ROOM.isUnlocked).toBe(true);
  });

  it('setTriggerMet(BEDROOM) không unlock nhưng set triggerMet', () => {
    useRoomStore.getState().setTriggerMet('BEDROOM');
    const { rooms } = useRoomStore.getState();
    expect(rooms.BEDROOM.unlockTriggerMet).toBe(true);
    expect(rooms.BEDROOM.isUnlocked).toBe(false);
  });

  it('loadFromLocal() restore từ MMKV', () => {
    mockStorage.set('rooms:unlock_state', {
      WORK_ROOM: { isUnlocked: true, unlockTriggerMet: true },
      KITCHEN: { isUnlocked: true, unlockTriggerMet: true },
      BEDROOM: { isUnlocked: false, unlockTriggerMet: false },
      LIVING_ROOM: { isUnlocked: false, unlockTriggerMet: false },
      BATHROOM: { isUnlocked: false, unlockTriggerMet: false },
      GARDEN: { isUnlocked: false, unlockTriggerMet: false },
    });
    useRoomStore.getState().loadFromLocal();
    const { rooms } = useRoomStore.getState();
    expect(rooms.KITCHEN.isUnlocked).toBe(true);
  });
});

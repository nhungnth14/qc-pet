// In-memory mock cho ./storage (MMKV mock mặc định stateless).
import { rewardEventBus } from './reward-event-bus';

jest.mock('./storage', () => {
  const mem = new Map<string, string>();
  return {
    storage: {
      setItem: (k: string, v: unknown) => {
        mem.set(k, JSON.stringify(v));
      },
      getItem: (k: string) => (mem.has(k) ? JSON.parse(mem.get(k) as string) : null),
      remove: (k: string) => {
        mem.delete(k);
      },
    },
  };
});

afterEach(() => {
  // drain pending còn sót giữa các test
  rewardEventBus.consumePending();
});

describe('rewardEventBus · consumePending (Story 6.2 deferred animation)', () => {
  it('server_committed set pending → consumePending trả về payload + xoá (đúng 1 lần)', () => {
    rewardEventBus.emit('server_committed', { type: 'bc', amount: 10, from: 100, to: 110 });

    const first = rewardEventBus.consumePending();
    expect(first).toEqual({ type: 'bc', amount: 10, from: 100, to: 110 });

    // Consume lần 2 → null (Work Room mount 2 lần không animate đôi)
    expect(rewardEventBus.consumePending()).toBeNull();
  });

  it('không có pending → trả null', () => {
    expect(rewardEventBus.consumePending()).toBeNull();
  });
});

describe('rewardEventBus · on/emit (NFR-1: server_committed trước animation_triggered)', () => {
  it('animation_triggered KHÔNG chạy callback nếu chưa có server_committed', () => {
    const cb = jest.fn();
    const off = rewardEventBus.on('animation_triggered', cb);
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    rewardEventBus.emit('animation_triggered', { type: 'bc' });
    expect(cb).not.toHaveBeenCalled();

    rewardEventBus.emit('server_committed', { type: 'bc', amount: 5 });
    rewardEventBus.emit('animation_triggered', { type: 'bc', amount: 5 });
    expect(cb).toHaveBeenCalledTimes(1);

    off();
    errSpy.mockRestore();
  });
});

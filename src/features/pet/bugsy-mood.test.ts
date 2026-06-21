import { getNeverDieMessage } from './bugsy-mood';

describe('getNeverDieMessage', () => {
  it('trả message cảm xúc khi có bar = 0', () => {
    const msg = getNeverDieMessage({ hunger: 0, happiness: 50, health: 50, discipline: 50 }, 'Bugsy');
    expect(msg).toBe('Bugsy ơi, mình nhớ bạn quá...');
  });

  it('dùng đúng tên pet', () => {
    const msg = getNeverDieMessage({ hunger: 80, happiness: 80, health: 0, discipline: 80 }, 'Kiwi');
    expect(msg).toContain('Kiwi');
  });

  it('null khi mọi bar > 0', () => {
    expect(getNeverDieMessage({ hunger: 1, happiness: 1, health: 1, discipline: 1 }, 'Bugsy')).toBeNull();
  });
});

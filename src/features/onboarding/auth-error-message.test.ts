import { authErrorMessage } from './auth-error-message';

describe('authErrorMessage', () => {
  it('map "Auth session missing!" → câu phiên đăng nhập', () => {
    expect(authErrorMessage(new Error('Auth session missing!'))).toMatch(/phiên đăng nhập/);
  });

  it('map email đã đăng ký → gợi ý đăng nhập', () => {
    expect(authErrorMessage({ message: 'User already registered' })).toMatch(/đã được dùng/);
  });

  it('map mật khẩu yếu → cần ít nhất 6 ký tự', () => {
    expect(authErrorMessage(new Error('Password should be at least 6 characters'))).toMatch(/6 ký tự/);
  });

  it('map lỗi mạng → kiểm tra kết nối', () => {
    expect(authErrorMessage(new Error('Network request failed'))).toMatch(/mất mạng|kết nối/i);
  });

  it('lỗi rỗng / null / lạ → fallback', () => {
    expect(authErrorMessage(null)).toBe('Đăng ký thất bại, thử lại nhé');
    expect(authErrorMessage({})).toBe('Đăng ký thất bại, thử lại nhé');
    expect(authErrorMessage(new Error('totally unexpected weirdness'))).toBe('Đăng ký thất bại, thử lại nhé');
  });

  it('map email sai định dạng → kiểm tra lại', () => {
    expect(authErrorMessage(new Error('Invalid email address'))).toMatch(/định dạng/);
  });

  it('nhận err dạng string (không phải Error object)', () => {
    expect(authErrorMessage('Auth session missing')).toMatch(/phiên đăng nhập/);
  });
});

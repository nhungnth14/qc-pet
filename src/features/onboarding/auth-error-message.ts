/**
 * Map lỗi auth (Supabase / network) → thông báo tiếng Việt thân thiện cho người
 * dùng (ngữ điệu mình/bạn). Tách message kỹ thuật tiếng Anh khỏi UI. Pure → dễ test.
 *
 * Lưu ý: sau fix self-heal ở `signUpWithEmail`, "Auth session missing" gần như
 * không còn nổi lên; vẫn map phòng thủ tầng 2 cho các lỗi nghiệp vụ khác.
 */

const FALLBACK = 'Đăng ký thất bại, thử lại nhé';

function extractMessage(err: unknown): string {
  if (typeof err === 'string')
    return err;
  if (err && typeof err === 'object' && 'message' in err)
    return String((err as { message: unknown }).message ?? '');
  return '';
}

export function authErrorMessage(err: unknown): string {
  const msg = extractMessage(err).toLowerCase();

  if (!msg)
    return FALLBACK;
  if (msg.includes('auth session missing') || msg.includes('session'))
    return 'Mất kết nối phiên đăng nhập, bạn thử lại giúp mình nhé';
  if (
    msg.includes('already registered')
    || msg.includes('already been registered')
    || msg.includes('email_exists')
    || msg.includes('user already')
  ) {
    return 'Email này đã được dùng rồi. Bạn đăng nhập thay vì tạo mới nhé';
  }
  if (msg.includes('password') && (msg.includes('least') || msg.includes('weak') || msg.includes('6')))
    return 'Mật khẩu cần ít nhất 6 ký tự';
  if (msg.includes('invalid') && msg.includes('email'))
    return 'Email chưa đúng định dạng, bạn kiểm tra lại nhé';
  if (
    msg.includes('network')
    || msg.includes('fetch')
    || msg.includes('timeout')
    || msg.includes('connection')
  ) {
    return 'Mất mạng rồi, bạn kiểm tra kết nối giúp mình nhé';
  }

  return FALLBACK;
}

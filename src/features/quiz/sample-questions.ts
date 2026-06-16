import type { Question } from './question-types';

/**
 * Sample questions — 1 câu/format (Story 5.4). Tiếng Việt, register `mình/bạn`,
 * ISTQB context. Tạm thời thay cho content pipeline (Story 1.1, Epic 1 chưa build).
 * Khi content có `format` field, thay nguồn này bằng data từ manifest.
 */
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-mcq-1',
    format: 'mcq',
    prompt: 'Bug làm crash app khi checkout. Mức Severity phù hợp nhất là gì?',
    options: ['Low', 'Medium', 'High', 'Critical'],
    correctIndex: 3,
  },
  {
    id: 'q-swipe-1',
    format: 'severity_swipe',
    prompt: 'Vuốt để phân loại Severity cho bug này',
    bugDescription:
      'Nút "Thanh toán" sai màu (xanh lá thay vì xanh dương) ở trang admin nội bộ. Chức năng vẫn chạy đúng.',
    correctSeverity: 'low',
  },
  {
    id: 'q-spot-1',
    format: 'spot_the_defect',
    prompt: 'Chạm vào chỗ có lỗi trên màn hình đăng nhập',
    sceneLabel: 'Form đăng nhập: ô Email, ô Mật khẩu, nút Đăng nhập',
    zones: [
      { id: 'z-email', x: 8, y: 18, w: 84, h: 18, isDefect: false, label: 'Ô Email' },
      { id: 'z-pass', x: 8, y: 42, w: 84, h: 18, isDefect: true, label: 'Ô Mật khẩu hiện chữ (không che)' },
      { id: 'z-btn', x: 8, y: 70, w: 84, h: 16, isDefect: false, label: 'Nút Đăng nhập' },
    ],
  },
  {
    id: 'q-bugreport-1',
    format: 'bug_report_surgery',
    prompt: 'Đặt từng mẩu vào đúng ô của bug report',
    fields: [
      { key: 'title', label: 'Tiêu đề' },
      { key: 'steps', label: 'Các bước tái hiện' },
      { key: 'expected_actual', label: 'Kỳ vọng / Thực tế' },
      { key: 'severity', label: 'Mức độ' },
    ],
    blocks: [
      { id: 'b-title', text: 'Login fail trên iOS 17 khi mật khẩu có ký tự đặc biệt', correctField: 'title' },
      { id: 'b-steps', text: '1. Mở app 2. Nhập mật khẩu có @ 3. Bấm Đăng nhập', correctField: 'steps' },
      { id: 'b-ea', text: 'Kỳ vọng: đăng nhập OK · Thực tế: báo lỗi sai mật khẩu', correctField: 'expected_actual' },
      { id: 'b-sev', text: 'High', correctField: 'severity' },
    ],
  },
  {
    id: 'q-rewrite-1',
    format: 'rewrite_the_fail',
    prompt: 'Sắp xếp lại thành một test case rõ ràng',
    badText: 'test login (nó không chạy)',
    blocks: [
      { id: 'r-1', text: 'Cho người dùng đã đăng ký,' },
      { id: 'r-2', text: 'khi nhập đúng email và mật khẩu,' },
      { id: 'r-3', text: 'thì vào được trang chủ.' },
    ],
    correctOrder: ['r-1', 'r-2', 'r-3'],
  },
];

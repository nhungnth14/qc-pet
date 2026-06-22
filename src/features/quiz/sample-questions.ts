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
    isWarmup: true,
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
  {
    id: 'q-duel-1',
    format: 'priority_severity_duel',
    prompt: 'Chọn Priority và Severity cho bug này',
    bugDescription:
      'App mất toàn bộ dữ liệu giỏ hàng khi xoay ngang màn hình ở bước thanh toán — khách hàng đang mua hàng thật.',
    correctPriority: 'high',
    correctSeverity: 'high',
  },
  {
    id: 'q-boundary-1',
    format: 'boundary_attack',
    prompt: 'Ô tuổi chỉ nhận 18–60. Nhập các giá trị biên cần test:',
    scenario: 'Ô "Tuổi" hợp lệ khi 18 ≤ tuổi ≤ 60. Tìm các giá trị biên (boundary) nên kiểm thử.',
    expectedValues: ['17', '18', '60', '61'],
  },
  {
    id: 'q-chain-1',
    format: 'root_cause_chain',
    prompt: 'Sắp xếp chuỗi nhân–quả từ nguyên nhân gốc đến hậu quả',
    events: [
      { id: 'e-1', text: 'Thiếu kiểm tra null ở API user' },
      { id: 'e-2', text: 'Request trả về user = null' },
      { id: 'e-3', text: 'Code gọi user.name làm app crash' },
      { id: 'e-4', text: 'Người dùng thấy màn hình trắng' },
    ],
    correctOrder: ['e-1', 'e-2', 'e-3', 'e-4'],
  },
  {
    id: 'q-radar-1',
    format: 'risk_radar',
    prompt: 'Xếp hạng tính năng theo mức rủi ro (cao nhất lên đầu)',
    items: [
      { id: 'i-pay', text: 'Cổng thanh toán' },
      { id: 'i-login', text: 'Đăng nhập / xác thực' },
      { id: 'i-search', text: 'Tìm kiếm sản phẩm' },
      { id: 'i-theme', text: 'Đổi giao diện sáng/tối' },
    ],
    correctRanking: ['i-pay', 'i-login', 'i-search', 'i-theme'],
  },
  {
    id: 'q-testcase-1',
    format: 'complete_test_case',
    prompt: 'Điền nốt test case đăng nhập (chạm để nhập):',
    fields: [
      {
        key: 'precondition',
        label: 'Điều kiện tiên quyết',
        keywords: ['đã đăng ký', 'tài khoản', 'account', 'tồn tại'],
      },
      {
        key: 'expected',
        label: 'Kết quả kỳ vọng',
        keywords: ['trang chủ', 'đăng nhập thành công', 'vào được', 'home'],
      },
    ],
  },
];

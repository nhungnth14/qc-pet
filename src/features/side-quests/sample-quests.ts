import type { SideQuestDef, SideQuestType } from './side-quest-types';

/**
 * Curated content cho Side Quests (Story 5.6). Tiếng Việt, register `mình/bạn`, ISTQB terms
 * giữ tiếng Anh + giải thích. Tạm thời self-define (như sample-questions 5-4/5-5) — content
 * library thật (Story 1.1, Epic 1) sẽ thay nguồn này sau.
 */
export const SIDE_QUEST_DEFS: SideQuestDef[] = [
  {
    type: 'bug_hunt',
    name: 'Bug Hunt',
    emoji: '🔍',
    estMinutes: 10,
    bugsyIntro:
      'Đi săn bug thật nào! Tìm 1 lỗi trong app/web bạn đang dùng hoặc môi trường staging '
      + 'của bạn, rồi viết bug report cho mình. Mình không chấm đúng sai — cứ ghi lại là được!',
    formKind: 'bug_report',
  },
  {
    type: 'peer_review',
    name: 'Peer Review',
    emoji: '🧑‍🏫',
    estMinutes: 8,
    bugsyIntro:
      'Một bạn QA mới (junior) vừa viết test case dưới đây. Bạn đọc và góp ý giúp nhé: chỗ nào '
      + 'thiếu, chỗ nào nên cải thiện?',
    formKind: 'freeform',
    freeformLabel: 'Nhận xét của bạn',
    freeformPlaceholder: 'Ví dụ: thiếu precondition, expected result chưa rõ, nên tách bước 3…',
    contextTitle: 'Test case của junior QA',
    contextText:
      'Title: Test login\n'
      + 'Steps: 1. Mở app 2. Đăng nhập\n'
      + 'Expected: Vào được app\n'
      + '(Không có precondition, không nói rõ dữ liệu nhập, expected mơ hồ.)',
  },
  {
    type: 'repro_steps',
    name: 'Repro Steps',
    emoji: '🪜',
    estMinutes: 8,
    bugsyIntro:
      'Dev nhận được bug nhưng tái hiện (reproduce) không ra. Bạn viết lại các bước tái hiện '
      + 'chuẩn — đánh số, ngắn gọn, tối thiểu (minimal) — để dev làm theo là dính bug ngay.',
    formKind: 'freeform',
    freeformLabel: 'Repro steps của bạn',
    freeformPlaceholder: '1. …\n2. …\n3. …',
    contextTitle: 'Mô tả bug',
    contextText:
      'Người dùng báo: "App bị văng khi mình bấm thanh toán." Không có bước cụ thể, không biết '
      + 'thiết bị, không biết giỏ hàng có gì. Hãy viết repro steps chuẩn từ mô tả này.',
  },
  {
    type: 'simulated_bug_hunt',
    name: 'Simulated Bug Hunt',
    emoji: '🧪',
    estMinutes: 10,
    bugsyIntro:
      'Chưa gặp bug thật tuần này? Không sao! Mình dựng sẵn một môi trường staging giả lập bên '
      + 'dưới. Bạn "test" theo kịch bản rồi report bug tìm được nhé.',
    formKind: 'bug_report',
    contextTitle: 'Kịch bản staging giả lập',
    contextText:
      'App đặt món ăn. Màn Checkout: chọn món → nhập mã giảm giá → bấm "Đặt hàng".\n'
      + 'Quan sát: khi nhập mã giảm giá "SALE50" rồi xoá đi, tổng tiền vẫn giữ giá đã giảm. '
      + 'Khi đặt 0 món vẫn bấm "Đặt hàng" được. Hãy tìm & report 1 bug.',
  },
];

export function getQuestDef(type: SideQuestType): SideQuestDef | undefined {
  return SIDE_QUEST_DEFS.find(q => q.type === type);
}

/** 3 quest hiện trong list màn Side Quests (Simulated chỉ vào qua Zero-Bug flow — AC1/AC5). */
export const LISTED_QUEST_TYPES: SideQuestType[] = ['bug_hunt', 'peer_review', 'repro_steps'];

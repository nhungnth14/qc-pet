// Good Morning Moment (Story 4-4). Greeting cosmetic (không reward) → tính "hôm nay" client-side
// từ clock server-offset theo UTC+7. Greeting đổi theo evolution version của Bugsy.

const UTC7_OFFSET_MS = 7 * 60 * 60 * 1000;

export type GoodMorningGreeting = {
  text: string;
  subtitle?: string;
};

/** Date key 'YYYY-MM-DD' theo giờ UTC+7 (để so sánh "ngày" cho once/day). */
export function dateKeyUTC7(ms: number): string {
  return new Date(ms + UTC7_OFFSET_MS).toISOString().slice(0, 10);
}

/** Greeting buổi sáng theo evolution version (FR-4.4). */
export function getGoodMorningGreeting(version: string, name: string): GoodMorningGreeting {
  switch (version) {
    case 'v0.1':
      return { text: `Chào buổi sáng ${name}! 🌅` };
    case 'v0.5':
      return { text: 'Chào buổi sáng! Hôm nay học gì vui không? 🌅' };
    default:
      // v1.0+ : ngôn ngữ ĐNA + subtitle tiếng Việt (v2.0+ dream-destination → placeholder)
      return { text: `Selamat pagi, ${name}! 🌅`, subtitle: 'Chào buổi sáng!' };
  }
}

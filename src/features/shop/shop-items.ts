// Pure Item Shop config (Story 10.2). Placeholder browse-only — Phase 2 full shop OUT OF SCOPE.

export type ShopCategory = 'wallpaper' | 'outfit' | 'toy';

export type ShopItem = {
  id: string;
  name: string;
  category: ShopCategory;
  /** BC price (greyed out — chưa mua được). */
  price: number;
  emoji: string;
};

export const SHOP_CATEGORY_LABEL: Record<ShopCategory, string> = {
  wallpaper: 'Hình nền',
  outfit: 'Trang phục',
  toy: 'Đồ chơi',
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'wp_sunset', name: 'Tường hoàng hôn', category: 'wallpaper', price: 120, emoji: '🌇' },
  { id: 'wp_ocean', name: 'Tường đại dương', category: 'wallpaper', price: 150, emoji: '🌊' },
  { id: 'of_scarf', name: 'Khăn quàng len', category: 'outfit', price: 80, emoji: '🧣' },
  { id: 'of_hat', name: 'Mũ thám tử', category: 'outfit', price: 100, emoji: '🎩' },
  { id: 'toy_ball', name: 'Bóng nảy', category: 'toy', price: 50, emoji: '🏀' },
  { id: 'toy_book', name: 'Sách bug nhỏ', category: 'toy', price: 60, emoji: '📕' },
];

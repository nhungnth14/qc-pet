import { SHOP_CATEGORY_LABEL, SHOP_ITEMS } from './shop-items';

describe('shop items', () => {
  it('có item placeholder', () => {
    expect(SHOP_ITEMS.length).toBeGreaterThan(0);
  });

  it('mỗi item đủ field + price > 0 + category hợp lệ', () => {
    const valid = new Set(['wallpaper', 'outfit', 'toy']);
    for (const item of SHOP_ITEMS) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.emoji.length).toBeGreaterThan(0);
      expect(item.price).toBeGreaterThan(0);
      expect(valid.has(item.category)).toBe(true);
    }
  });

  it('id không trùng', () => {
    expect(new Set(SHOP_ITEMS.map(i => i.id)).size).toBe(SHOP_ITEMS.length);
  });

  it('đủ label cho 3 category', () => {
    expect(SHOP_CATEGORY_LABEL.wallpaper).toBeTruthy();
    expect(SHOP_CATEGORY_LABEL.outfit).toBeTruthy();
    expect(SHOP_CATEGORY_LABEL.toy).toBeTruthy();
  });
});

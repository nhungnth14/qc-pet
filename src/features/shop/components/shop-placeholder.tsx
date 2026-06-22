import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SHOP_CATEGORY_LABEL, SHOP_ITEMS } from '../shop-items';

/**
 * Item Shop placeholder (Story 10.2). Browse-only: card grid + "Sắp ra mắt" chip + Buy greyed (vẫn
 * tap được → Bugsy speech bubble). KHÔNG cart/transaction (Phase 2 OUT OF SCOPE). Positive framing.
 */
export function ShopPlaceholder() {
  const [bubble, setBubble] = useState(false);

  return (
    <View style={styles.shop}>
      <Text style={styles.header}>Cửa hàng Bugsy 🏪 (Sắp ra mắt)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {SHOP_ITEMS.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cat}>{SHOP_CATEGORY_LABEL[item.category]}</Text>
            <View style={styles.comingChip}>
              <Text style={styles.comingText}>Sắp ra mắt</Text>
            </View>
            <Text style={styles.price}>{`${item.price} 🪲`}</Text>
            <Pressable
              style={styles.buyGreyed}
              onPress={() => setBubble(true)}
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              accessibilityLabel={`Mua ${item.name} — sắp ra mắt`}
            >
              <Text style={styles.buyText}>Mua</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {bubble && (
        <Pressable style={styles.bubbleWrap} onPress={() => setBubble(false)} accessibilityRole="button" accessibilityLabel="Đóng">
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Mình đang làm thêm đồ cho bạn! Chờ mình một chút nha 🛍️</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shop: { alignSelf: 'stretch', gap: 10 },
  header: { fontSize: 15, fontWeight: '900', color: '#001a41', textAlign: 'center' },
  row: { gap: 12, paddingHorizontal: 4, paddingVertical: 4 },
  card: {
    width: 110,
    alignItems: 'center',
    gap: 4,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  emoji: { fontSize: 32 },
  name: { fontSize: 12, fontWeight: '800', color: '#001a41', textAlign: 'center' },
  cat: { fontSize: 10, fontWeight: '600', color: '#3a4a66' },
  comingChip: { backgroundColor: '#FFE082', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  comingText: { fontSize: 9, fontWeight: '800', color: '#001a41' },
  price: { fontSize: 11, fontWeight: '700', color: '#9aa5b5' },
  buyGreyed: {
    opacity: 0.45,
    backgroundColor: '#9aa5b5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  buyText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  bubbleWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#001a41',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  bubbleText: { fontSize: 14, fontWeight: '700', color: '#001a41', textAlign: 'center' },
});

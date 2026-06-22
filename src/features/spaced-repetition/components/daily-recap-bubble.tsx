import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type DailyRecapBubbleProps = {
  message: string;
  onDismiss: () => void;
};

const AUTO_DISMISS_MS = 5000;

/**
 * Daily Recap Bubble (Story 8.2). CSS thought-bubble (không modal/slide-up). Tap-dismiss + auto 5s.
 * Vị trí trên Bugsy đang ngủ; không full-screen → swipe-to-next-room vẫn được ngoài vùng bubble.
 */
export function DailyRecapBubble({ message, onDismiss }: DailyRecapBubbleProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Pressable style={styles.wrap} onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Đóng tóm tắt ngày">
      <View style={styles.bubble}>
        <Text style={styles.text}>{message}</Text>
      </View>
      <View style={styles.tailBig} />
      <View style={styles.tailSmall} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#001a41',
    paddingHorizontal: 18,
    paddingVertical: 14,
    maxWidth: 280,
  },
  text: { fontSize: 14, fontWeight: '700', color: '#001a41', textAlign: 'center', lineHeight: 20 },
  tailBig: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#001a41',
    marginTop: 4,
  },
  tailSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#001a41',
    marginTop: 3,
  },
});

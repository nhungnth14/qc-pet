import { StyleSheet, Text, View } from 'react-native';
import { useGoodMorning } from '../use-good-morning';

/**
 * Good Morning Moment overlay (Story 4-4). Hiện greeting buổi sáng (1 lần/ngày, auto-dismiss 2.5s).
 * Non-intrusive: pointerEvents none, không chặn thao tác; tự ẩn không cần tap.
 */
export function GoodMorningMoment() {
  const greeting = useGoodMorning();
  if (!greeting)
    return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.bubble}>
        <Text style={styles.text}>{greeting.text}</Text>
        {greeting.subtitle ? <Text style={styles.subtitle}>{greeting.subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 35,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#001a41',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  text: { fontSize: 16, fontWeight: '800', color: '#001a41', textAlign: 'center' },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#3a4a66', textAlign: 'center' },
});

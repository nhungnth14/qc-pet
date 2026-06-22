import type { RoomSuggestion } from '../use-room-suggestion';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SuggestionBubbleProps = {
  suggestion: RoomSuggestion | null;
  onDismiss: () => void;
};

/** Speech bubble overlay khi long-press Bugsy. Tap bất kỳ đâu → dismiss. */
export function SuggestionBubble({ suggestion, onDismiss }: SuggestionBubbleProps) {
  if (!suggestion)
    return null;

  return (
    <Pressable
      style={styles.overlay}
      onPress={onDismiss}
      accessibilityRole="button"
      accessibilityLabel="Đóng gợi ý của Bugsy"
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{suggestion.message}</Text>
      </View>
      <Text style={styles.hint}>Chạm để đóng</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0,26,65,0.25)',
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#001a41',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: '#001a41',
    textAlign: 'center',
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

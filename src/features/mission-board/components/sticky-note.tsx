import type { WallNote } from '../mission-board-types';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { noteRotation, wallColorFor } from '../mission-board-types';

type Props = {
  note: WallNote;
  index: number;
};

/**
 * Sticky note (Story 5.7 AC4) — xoay ±5° (deterministic theo id), màu cycle 4 màu theo
 * colorIndex, fly-in animation (Reanimated `entering`, stagger nhẹ theo index).
 */
export function StickyNote({ note, index }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(350).delay(index * 40)}
      style={[
        styles.note,
        { backgroundColor: wallColorFor(note.colorIndex), transform: [{ rotate: `${noteRotation(note.id)}deg` }] },
      ]}
      accessibilityLabel={`Sticky note: ${note.label}`}
    >
      <Text style={styles.label} numberOfLines={3}>{note.label}</Text>
      {note.sublabel && <Text style={styles.sublabel} numberOfLines={1}>{note.sublabel}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  note: {
    width: 104,
    minHeight: 104,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 10,
    gap: 4,
    justifyContent: 'center',
    boxShadow: '0px 4px 0px 0px rgba(0, 26, 65, 0.85)',
  },
  label: { fontSize: 12, fontWeight: '800', color: '#001a41' },
  sublabel: { fontSize: 10, fontWeight: '600', color: '#3a4a66' },
});

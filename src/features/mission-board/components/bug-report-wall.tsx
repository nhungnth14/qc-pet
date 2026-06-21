import type { WallNote } from '../mission-board-types';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Confetti } from '@/components/confetti';
import { isFullWall } from '../mission-board-types';
import { StickyNote } from './sticky-note';

type Props = {
  notes: WallNote[];
};

/**
 * Bug Report Wall (Story 5.7 AC4–5) — grid sticky notes. Tách riêng, nhận `notes` qua props
 * → tái dùng My Journey view (Epic 7). Full wall (≥30) → confetti + Bugsy excited (1 lần).
 */
export function BugReportWall({ notes }: Props) {
  const [celebrate, setCelebrate] = useState(false);
  const celebratedRef = useRef(false);

  const full = isFullWall(notes.length);

  useEffect(() => {
    if (full && !celebratedRef.current) {
      celebratedRef.current = true;
      // rAF: tránh setState đồng bộ trong effect (react-compiler cascading-render).
      const raf = requestAnimationFrame(() => setCelebrate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [full]);

  if (notes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📝</Text>
        <Text style={styles.emptyText}>
          Hoàn thành Core Mission hoặc Side Quest để thêm sticky note đầu tiên!
        </Text>
      </View>
    );
  }

  return (
    <View>
      {full && (
        <View style={styles.fullBanner}>
          <Text style={styles.fullText}>🎉 Bugsy siêu vui — wall đầy rồi! 🐣✨</Text>
        </View>
      )}
      <View style={styles.grid}>
        {notes.map((note, i) => (
          <StickyNote key={note.id} note={note} index={i} />
        ))}
      </View>
      {celebrate && <Confetti onDone={() => setCelebrate(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  empty: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#555' },
  fullBanner: {
    backgroundColor: '#BFFFA1',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 10,
    marginBottom: 12,
  },
  fullText: { fontSize: 13, fontWeight: '800', color: '#001a41', textAlign: 'center' },
});

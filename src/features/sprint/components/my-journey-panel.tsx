import type { JourneyEntry } from '../journey';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SlideUpPanel } from '@/components';
import { useSessionStore } from '@/stores/session-store';
import { useConnectivity } from '@/stores/use-connectivity';
import { JOURNEY_KIND_ICON } from '../journey';
import { getJourney } from '../journey-api';

type MyJourneyPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * My Journey timeline (Story 7.2). Gộp evidence/bug-log/retrospective/evolution → newest-first.
 * Tap entry → expand detail. Offline → banner. Server-only, permanent.
 */
export function MyJourneyPanel({ isOpen, onClose }: MyJourneyPanelProps) {
  const userId = useSessionStore(s => s.userId);
  const online = useConnectivity(s => s.online);
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId)
      return;
    let active = true;
    getJourney(userId)
      .then((e) => {
        if (active)
          setEntries(e);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isOpen, userId]);

  return (
    <SlideUpPanel isOpen={isOpen} onClose={onClose} snapPoints={['90%']}>
      <View style={styles.wrap}>
        <Text style={styles.title}>🗺️ Hành trình của bạn</Text>
        {!online && (
          <Text style={styles.offline}>Đang offline — dữ liệu có thể chưa cập nhật</Text>
        )}
        <ScrollView contentContainerStyle={styles.list}>
          {entries.length === 0
            ? <Text style={styles.empty}>Chưa có cột mốc nào — bắt đầu học cùng Bugsy nhé!</Text>
            : entries.map(e => (
                <Pressable
                  key={e.id}
                  style={styles.entry}
                  onPress={() => setExpanded(expanded === e.id ? null : e.id)}
                  accessibilityRole="button"
                  accessibilityLabel={e.title}
                >
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{`${JOURNEY_KIND_ICON[e.kind]} ${e.title}`}</Text>
                    <Text style={styles.entryDate}>{new Date(e.dateMs).toISOString().slice(0, 10)}</Text>
                  </View>
                  {expanded === e.id && e.detail.length > 0 && (
                    <Text style={styles.entryDetail}>{e.detail}</Text>
                  )}
                </Pressable>
              ))}
        </ScrollView>
      </View>
    </SlideUpPanel>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 8, gap: 10 },
  title: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  offline: { fontSize: 12, fontWeight: '700', color: '#ba1a1a' },
  list: { gap: 10, paddingBottom: 24 },
  empty: { fontSize: 14, fontWeight: '600', color: '#3a4a66', paddingVertical: 24, textAlign: 'center' },
  entry: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 12,
    gap: 4,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  entryTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: '#001a41' },
  entryDate: { fontSize: 11, fontWeight: '600', color: '#8a97ab' },
  entryDetail: { fontSize: 13, fontWeight: '500', color: '#3a4a66', lineHeight: 19 },
});

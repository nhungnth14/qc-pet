import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CurrencyHeader, NeedBarComponent } from '@/components';
import { usePetStore } from '@/stores/pet-store';

export function WorkRoomScreen() {
  const router = useRouter();
  const petName = usePetStore(s => s.name);
  const needBars = usePetStore(s => s.needBars);
  const loadFromLocal = usePetStore(s => s.loadFromLocal);
  const bugsyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadFromLocal();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bugsyAnim, { toValue: -10, duration: 1000, useNativeDriver: true }),
        Animated.timing(bugsyAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    ).start();
    // NOTE: effect chạy MỘT lần lúc mount (load state local + start idle animation). KHÔNG
    // disable react-hooks/exhaustive-deps — react-compiler (error) cấm component có rule bị
    // disable. Warning missing-deps là advisory, cố ý giữ; xử lý khi polish component.
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roomLabel}>🖥️ Work Room</Text>
        <CurrencyHeader />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Bugsy */}
        <View style={styles.bugsySection}>
          <Animated.Text style={[styles.bugsy, { transform: [{ translateY: bugsyAnim }] }]}>
            🐣
          </Animated.Text>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{`Chào ${petName}! Học gì hôm nay? 📚`}</Text>
          </View>
        </View>

        {/* Need Bars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái Bugsy</Text>
          <NeedBarComponent label="🍗 Hunger" value={needBars.hunger} fillClassName="bg-need-hunger" />
          <NeedBarComponent label="😊 Happiness" value={needBars.happiness} fillClassName="bg-need-happiness" />
          <NeedBarComponent label="💪 Health" value={needBars.health} fillClassName="bg-need-health" />
          <NeedBarComponent label="📏 Discipline" value={needBars.discipline} fillClassName="bg-need-discipline" />
        </View>

        {/* Core Mission CTA */}
        <Pressable style={styles.missionBtn} onPress={() => router.push('/(app)/core-mission')}>
          <Text style={styles.missionBtnEmoji}>🎯</Text>
          <View style={styles.missionBtnText}>
            <Text style={styles.missionBtnTitle}>Core Mission hôm nay</Text>
            <Text style={styles.missionBtnSub}>Bug Detective · Lesson 1 · +10 BC · +6 QP</Text>
          </View>
          <Text style={styles.missionBtnArrow}>→</Text>
        </Pressable>

        {/* Mission Board */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission Board</Text>
          <View style={styles.kanbanRow}>
            {['TODO', 'IN PROGRESS', 'DONE'].map(col => (
              <View key={col} style={styles.kanbanCol}>
                <Text style={styles.kanbanHeader}>{col}</Text>
                {col === 'TODO' && (
                  <View style={styles.kanbanCard}>
                    <Text style={styles.kanbanCardText}>Bug Detective #1</Text>
                  </View>
                )}
                {col === 'IN PROGRESS' && (
                  <View style={[styles.kanbanCard, styles.kanbanCardActive]}>
                    <Text style={styles.kanbanCardText}>Onboarding ✅</Text>
                  </View>
                )}
                {col === 'DONE' && <Text style={styles.kanbanEmpty}>—</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Bug Report Wall teaser */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bug Report Wall 📌</Text>
          <View style={styles.wallPreview}>
            <Text style={styles.wallEmoji}>📝</Text>
            <Text style={styles.wallText}>
              Hoàn thành Core Mission để thêm sticky note đầu tiên!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5D9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  roomLabel: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  bugsySection: { alignItems: 'center', gap: 12 },
  bugsy: { fontSize: 80 },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  speechText: { fontSize: 15, fontWeight: '700', color: '#001a41', textAlign: 'center' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  missionBtn: {
    backgroundColor: '#006491',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  missionBtnEmoji: { fontSize: 32 },
  missionBtnText: { flex: 1, gap: 2 },
  missionBtnTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  missionBtnSub: { fontSize: 12, fontWeight: '600', color: '#22b5ff' },
  missionBtnArrow: { fontSize: 24, color: '#fff', fontWeight: '800' },
  kanbanRow: { flexDirection: 'row', gap: 8 },
  kanbanCol: { flex: 1, gap: 8 },
  kanbanHeader: { fontSize: 10, fontWeight: '800', color: '#888', textAlign: 'center' },
  kanbanCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 10,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  kanbanCardActive: { backgroundColor: '#22b5ff' },
  kanbanCardText: { fontSize: 11, fontWeight: '700', color: '#001a41' },
  kanbanEmpty: { textAlign: 'center', color: '#ccc', fontSize: 16 },
  wallPreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wallEmoji: { fontSize: 32 },
  wallText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#555' },
});

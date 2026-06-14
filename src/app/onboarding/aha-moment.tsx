import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePetStore } from '@/stores/pet-store';

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function AhaMomentScreen() {
  const router = useRouter();
  const petName = usePetStore((s) => s.name);
  const [answer, setAnswer] = useState<AnswerState>('idle');
  const [showStoryRule, setShowStoryRule] = useState(false);
  const storyPanelAnim = useRef(new Animated.Value(400)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const handleAnswer = (choice: 'pass' | 'fail') => {
    if (answer !== 'idle') return;

    if (choice === 'fail') {
      // Correct!
      setAnswer('correct');
      Animated.spring(confettiAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => router.push('/onboarding/reward'), 1200);
      });
    } else {
      // Wrong → Story Rule
      setAnswer('wrong');
      setShowStoryRule(true);
      Animated.spring(storyPanelAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleStoryRuleDone = () => {
    router.push('/onboarding/reward');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>🐣 Bugsy nói</Text>
        <Text style={styles.headerSub}>
          Thử một tình huống nhỏ nha {petName}?
        </Text>
      </View>

      {/* Bug Ticket Card */}
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>BUG-042</Text>
          <View style={styles.ticketBadge}>
            <Text style={styles.ticketBadgeText}>🔴 HIGH</Text>
          </View>
        </View>
        <Text style={styles.ticketTitle}>
          Login button không hoạt động trên iOS 17
        </Text>
        <View style={styles.ticketDivider} />
        <Text style={styles.scenarioLabel}>📋 Scenario B</Text>
        <Text style={styles.scenarioText}>
          Developer nói "fixed". Bạn nhận build mới và test lại —{' '}
          <Text style={styles.scenarioBold}>bug vẫn còn đó.</Text>
        </Text>
        <Text style={styles.scenarioQuestion}>
          Bạn mark ticket này là...?
        </Text>
      </View>

      {/* Warm-up indicator */}
      <Text style={styles.warmupLabel}>⬇️ Câu khởi động — thử sức nào!</Text>

      {/* Answer buttons */}
      {answer === 'idle' && (
        <View style={styles.answerRow}>
          <Pressable
            style={[styles.answerBtn, styles.failBtn]}
            onPress={() => handleAnswer('fail')}
          >
            <Text style={styles.answerBtnText}>Fail ✗</Text>
          </Pressable>
          <Pressable
            style={[styles.answerBtn, styles.passBtn]}
            onPress={() => handleAnswer('pass')}
          >
            <Text style={styles.answerBtnText}>Pass ✓</Text>
          </Pressable>
        </View>
      )}

      {answer === 'correct' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultText}>Chính xác! Bug chưa fix = Fail!</Text>
        </View>
      )}

      {answer === 'wrong' && !showStoryRule && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Hmm, chưa đúng rồi...</Text>
        </View>
      )}

      {/* Story Rule Panel */}
      {showStoryRule && (
        <Animated.View
          style={[
            styles.storyPanel,
            { transform: [{ translateY: storyPanelAnim }] },
          ]}
        >
          <View style={styles.storyHandle} />
          <Text style={styles.storyTitle}>🐣 Bugsy kể...</Text>
          <Text style={styles.storyText}>
            Huy nhận được build mới từ dev, test lại — vẫn lỗi như cũ.
            Dev nói "tôi đã fix rồi mà" nhưng thực tế chưa deploy lên đúng
            môi trường. Huy mark{' '}
            <Text style={styles.storyBold}>Fail</Text> và comment rõ ràng.
          </Text>
          <View style={styles.ruleBox}>
            <Text style={styles.ruleLabel}>📌 Rule:</Text>
            <Text style={styles.ruleText}>
              "Fixed" của dev ≠ bug đã resolved. Tester phải verify độc lập
              trên đúng build/environment trước khi close ticket.
            </Text>
          </View>
          <Pressable style={styles.storyBtn} onPress={handleStoryRuleDone}>
            <Text style={styles.storyBtnText}>Hiểu rồi! Tiếp tục →</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001a41',
    padding: 20,
    gap: 16,
  },
  header: {
    paddingTop: 60,
    gap: 4,
  },
  headerLabel: {
    fontSize: 14,
    color: '#22b5ff',
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '800',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#22b5ff',
    padding: 20,
    gap: 12,
    shadowColor: '#22b5ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 6,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketId: { fontSize: 13, fontWeight: '700', color: '#888' },
  ticketBadge: {
    backgroundColor: '#ba1a1a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ticketBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  ticketTitle: { fontSize: 18, fontWeight: '800', color: '#001a41' },
  ticketDivider: { height: 1, backgroundColor: '#eee' },
  scenarioLabel: { fontSize: 13, fontWeight: '700', color: '#006491' },
  scenarioText: { fontSize: 15, color: '#333', lineHeight: 22 },
  scenarioBold: { fontWeight: '800', color: '#ba1a1a' },
  scenarioQuestion: {
    fontSize: 16,
    fontWeight: '800',
    color: '#001a41',
    marginTop: 4,
  },
  warmupLabel: {
    fontSize: 13,
    color: '#22b5ff',
    fontWeight: '600',
    textAlign: 'center',
  },
  answerRow: {
    flexDirection: 'row',
    gap: 16,
  },
  answerBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#001a41',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  failBtn: { backgroundColor: '#ba1a1a' },
  passBtn: { backgroundColor: '#2d7a2d' },
  answerBtnText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  resultBox: {
    alignItems: 'center',
    gap: 8,
    padding: 20,
  },
  resultEmoji: { fontSize: 48 },
  resultText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  storyPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#002e69',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    gap: 16,
    paddingBottom: 48,
    borderTopWidth: 3,
    borderColor: '#22b5ff',
  },
  storyHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#22b5ff',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  storyTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  storyText: { fontSize: 15, color: '#ccc', lineHeight: 22 },
  storyBold: { color: '#fff', fontWeight: '800' },
  ruleBox: {
    backgroundColor: '#BFFFA1',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  ruleLabel: { fontSize: 14, fontWeight: '800', color: '#001a41' },
  ruleText: { fontSize: 14, color: '#001a41', lineHeight: 20 },
  storyBtn: {
    backgroundColor: '#22b5ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001a41',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  storyBtnText: { fontSize: 16, fontWeight: '800', color: '#001a41' },
});

import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { updateGameState } from '@/lib/supabase-api';
import {
  createQuizSession,
  saveAnswer,
  completeQuizSession,
  getIncompleteSession,
} from '@/features/work-room/quiz-api';

const LESSON_ID = 'lesson-1';

const LESSON = {
  category: 'Bug Detective',
  title: 'Severity vs Priority — Không phải lúc nào cũng giống nhau',
  body: 'Severity đo mức độ ảnh hưởng kỹ thuật của bug lên system. Priority đo thứ tự xử lý từ góc nhìn business. Một bug UI nhỏ trên trang checkout có thể: Severity LOW (chỉ sai màu) nhưng Priority HIGH (ảnh hưởng conversion rate). Tester giỏi phân biệt hai khái niệm này khi viết bug report.',
  sourceTag: 'ISTQB-1.3',
};

const QUESTIONS = [
  {
    id: 1,
    text: '🌅 Warm-up: Bài học nào bạn đã học 3 ngày trước?',
    options: ['"Fixed" của dev = bug đã closed', '"Fixed" của dev ≠ bug đã closed'],
    correct: 1,
    isWarmup: true,
  },
  {
    id: 2,
    text: 'Bug làm crash app khi checkout. Mức Severity phù hợp là gì?',
    options: ['Low', 'Medium', 'High', 'Critical'],
    correct: 3,
  },
  {
    id: 3,
    text: 'Sai font chữ trên trang "About Us" — trong sprint release ngày mai. Priority là?',
    options: ['Low', 'Medium', 'High'],
    correct: 0,
  },
  {
    id: 4,
    text: 'Bug đổi màu nút Save → xanh lá (đúng ra là xanh dương), chỉ ảnh hưởng trang admin. Severity?',
    options: ['Critical', 'High', 'Low'],
    correct: 2,
  },
  {
    id: 5,
    text: '⭐ Thử thách: Bug payment gateway fail 100% trên iOS 17.4, chỉ 5% user dùng iOS 17.4. Severity vs Priority?',
    options: [
      'Severity HIGH, Priority HIGH',
      'Severity CRITICAL, Priority HIGH',
      'Severity LOW, Priority LOW',
      'Severity CRITICAL, Priority MEDIUM',
    ],
    correct: 1,
  },
];

type AnswerMap = Record<number, number>;

type ResumeInfo = {
  sessionId: string;
  currentIndex: number;
  answers: Record<string, number>;
};

export default function CoreMissionScreen() {
  const router = useRouter();
  const petName = usePetStore((s) => s.name);
  const addBC = usePetStore((s) => s.addBC);
  const addQP = usePetStore((s) => s.addQP);
  const setNeedBars = usePetStore((s) => s.setNeedBars);
  const userId = useSessionStore((s) => s.userId);

  const [phase, setPhase] = useState<'lesson' | 'quiz' | 'summary'>('lesson');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [showStoryRule, setShowStoryRule] = useState(false);
  const storyPanelAnim = useRef(new Animated.Value(400)).current;

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [summaryScore, setSummaryScore] = useState(0);

  // Ref to always have the latest answers without stale-closure issues
  const answersRef = useRef<AnswerMap>({});

  const question = QUESTIONS[currentQ];
  const totalQ = QUESTIONS.length;
  const correctCount = Object.entries(answers).filter(
    ([i, a]) => QUESTIONS[Number(i)].correct === a
  ).length;

  // On mount: check for incomplete session or create new one
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const existing = await getIncompleteSession(userId, LESSON_ID);
        if (existing) {
          setResumeInfo(existing);
        } else {
          const { sessionId: id } = await createQuizSession(userId, LESSON_ID);
          setSessionId(id);
        }
      } catch {
        // Network error — continue offline without a session
      }
    })();
  }, [userId]);

  const handleResume = () => {
    if (!resumeInfo) return;
    setSessionId(resumeInfo.sessionId);
    setCurrentQ(Math.min(resumeInfo.currentIndex, QUESTIONS.length - 1));
    const restored: AnswerMap = {};
    for (const [k, v] of Object.entries(resumeInfo.answers)) {
      restored[Number(k)] = v;
    }
    answersRef.current = restored;
    setAnswers(restored);
    setResumeInfo(null);
    setPhase('quiz');
  };

  const handleRestart = async () => {
    setResumeInfo(null);
    setCurrentQ(0);
    setAnswers({});
    answersRef.current = {};
    if (userId) {
      try {
        const { sessionId: id } = await createQuizSession(userId, LESSON_ID);
        setSessionId(id);
      } catch {
        setSessionId(null);
      }
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!question || answers[currentQ] !== undefined) return;
    const isCorrect = question.correct === optionIndex;
    const newAnswers = { ...answersRef.current, [currentQ]: optionIndex };
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    setLastCorrect(isCorrect);
    setShowFeedback(true);

    // Fire-and-forget: persist answer to Supabase
    if (sessionId) {
      saveAnswer(sessionId, currentQ, optionIndex).catch(() => {});
    }

    if (!isCorrect && !question.isWarmup) {
      setTimeout(() => {
        setShowStoryRule(true);
        Animated.spring(storyPanelAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }, 600);
    } else {
      setTimeout(nextQuestion, 1200);
    }
  };

  const nextQuestion = async () => {
    setShowFeedback(false);
    setShowStoryRule(false);
    storyPanelAnim.setValue(400);
    if (currentQ < totalQ - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      await finishMission();
    }
  };

  const finishMission = async () => {
    // Use ref to get up-to-date answers regardless of stale closures
    const finalAnswers = answersRef.current;
    const finalCorrectCount = Object.entries(finalAnswers).filter(
      ([i, a]) => QUESTIONS[Number(i)].correct === a
    ).length;
    const localBC = 10;
    const localQP = Math.max(6, Math.round((finalCorrectCount / totalQ) * 20));

    try {
      if (sessionId && userId) {
        const result = await completeQuizSession(sessionId, userId, finalCorrectCount, totalQ);
        addBC(result.bcEarned);
        addQP(result.qpEarned);
      } else {
        addBC(localBC);
        addQP(localQP);
      }
    } catch {
      // completeQuizSession failed — show summary with local calc, retry handled server-side
      addBC(localBC);
      addQP(localQP);
    }

    setNeedBars({ hunger: 100, happiness: 100, health: 80, discipline: 80 });
    setSummaryScore(finalCorrectCount);

    // Fire-and-forget: record mission completion date
    if (userId) {
      const today = new Date().toISOString().split('T')[0];
      updateGameState(userId, { lastMissionCompletedDate: today }).catch(() => {});
    }

    setPhase('summary');
  };

  if (phase === 'lesson') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.lessonScroll}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </Pressable>

        <View style={styles.lessonHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>🔍 {LESSON.category}</Text>
          </View>
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceText}>{LESSON.sourceTag}</Text>
          </View>
        </View>

        <Text style={styles.lessonTitle}>{LESSON.title}</Text>
        <Text style={styles.lessonBody}>{LESSON.body}</Text>

        {/* Resume banner — shown when there is an incomplete session */}
        {resumeInfo && (
          <View style={styles.resumeBanner}>
            <Text style={styles.resumeTitle}>👋 Chào mừng trở lại!</Text>
            <Text style={styles.resumeText}>
              Bạn đang ở câu {resumeInfo.currentIndex + 1}/{totalQ}
            </Text>
            <View style={styles.resumeActions}>
              <Pressable style={styles.resumeBtn} onPress={handleResume}>
                <Text style={styles.resumeBtnText}>Tiếp tục →</Text>
              </Pressable>
              <Pressable style={styles.restartBtn} onPress={handleRestart}>
                <Text style={styles.restartBtnText}>Làm lại</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.bugsyHint}>
          <Text style={styles.bugsyHintEmoji}>🐣</Text>
          <Text style={styles.bugsyHintText}>
            Đọc kỹ rồi nhé {petName}! Quiz sắp bắt đầu...
          </Text>
        </View>

        <Pressable style={styles.readyBtn} onPress={() => setPhase('quiz')}>
          <Text style={styles.readyBtnText}>Sẵn sàng! 🎯</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (phase === 'summary') {
    const title =
      summaryScore >= 4 ? '🏆 Bug Whisperer!' :
      summaryScore >= 3 ? '🔍 Defect Detective!' :
      summaryScore >= 2 ? '📋 QC Apprentice' : '🐛 Bug Magnet';

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.lessonScroll}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summaryScore}>{summaryScore}/{totalQ} đúng</Text>

        <View style={styles.cheatSheet}>
          <Text style={styles.cheatSheetTitle}>🐣 Bugsy's Cheat Sheet</Text>
          <View style={styles.cheatSection}>
            <Text style={styles.cheatSectionTitle}>3 điều nhớ:</Text>
            <Text style={styles.cheatItem}>• Severity = mức độ kỹ thuật của bug</Text>
            <Text style={styles.cheatItem}>• Priority = thứ tự xử lý theo business</Text>
            <Text style={styles.cheatItem}>• Hai số này KHÔNG cần bằng nhau</Text>
          </View>
          <View style={styles.cheatSection}>
            <Text style={styles.cheatSectionTitle}>2 lỗi phổ biến:</Text>
            <Text style={styles.cheatItem}>• Nhầm Severity với Priority khi report</Text>
            <Text style={styles.cheatItem}>• Mark Critical chỉ vì PM urgent</Text>
          </View>
          <View style={[styles.cheatSection, styles.cheatRealWorld]}>
            <Text style={styles.cheatSectionTitle}>1 đối chiếu thực tế:</Text>
            <Text style={styles.cheatItem}>
              Bug lỗi font nhỏ trên trang campaign sale → Sev LOW nhưng Priority HIGH
            </Text>
          </View>
        </View>

        <View style={styles.rewardRow}>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardText}>+10 🪲 BC</Text>
          </View>
          <View style={[styles.rewardBadge, styles.qpReward]}>
            <Text style={styles.rewardText}>+{Math.max(6, Math.round((summaryScore / totalQ) * 20))} ⭐ QP</Text>
          </View>
        </View>

        <Pressable style={styles.readyBtn} onPress={() => router.replace('/(app)')}>
          <Text style={styles.readyBtnText}>Về Work Room 🏠</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressBar}>
        {QUESTIONS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === currentQ && styles.progressDotActive,
              i < currentQ && styles.progressDotDone,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.quizScroll}>
        {/* Warm-up indicator */}
        {question.isWarmup && (
          <View style={styles.warmupBanner}>
            <Text style={styles.warmupText}>⬇️ Câu khởi động (không tính streak)</Text>
          </View>
        )}

        {/* Question card */}
        <View style={[styles.questionCard, question.isWarmup && styles.questionCardWarmup]}>
          <Text style={styles.questionCounter}>Câu {currentQ + 1}/{totalQ}</Text>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((opt, i) => {
            const isAnswered = answers[currentQ] !== undefined;
            const isSelected = answers[currentQ] === i;
            const isCorrect = question.correct === i;
            let btnStyle = styles.optionBtn;
            if (isAnswered && isSelected && isCorrect) btnStyle = { ...btnStyle, ...styles.optionCorrect };
            else if (isAnswered && isSelected && !isCorrect) btnStyle = { ...btnStyle, ...styles.optionWrong };
            else if (isAnswered && isCorrect) btnStyle = { ...btnStyle, ...styles.optionCorrectHint };

            return (
              <Pressable key={i} style={btnStyle} onPress={() => handleAnswer(i)}>
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Story Rule Panel */}
      {showStoryRule && (
        <Animated.View
          style={[styles.storyPanel, { transform: [{ translateY: storyPanelAnim }] }]}
        >
          <View style={styles.storyHandle} />
          <Text style={styles.storyTitle}>🐣 Bugsy giải thích...</Text>
          <Text style={styles.storyText}>
            Severity và Priority là 2 chiều khác nhau. Dev/QA quyết định Severity dựa trên
            technical impact. PM/Business quyết định Priority dựa trên business risk.
          </Text>
          <View style={styles.ruleBox}>
            <Text style={styles.ruleLabel}>📌 Rule:</Text>
            <Text style={styles.ruleText}>
              Luôn điền CẢ HAI Severity và Priority trong bug report. Đừng để người đọc
              phải đoán.
            </Text>
          </View>
          <Pressable style={styles.storyBtn} onPress={nextQuestion}>
            <Text style={styles.storyBtnText}>Hiểu rồi! Tiếp →</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001a41' },
  lessonScroll: { padding: 24, gap: 20, paddingTop: 60, paddingBottom: 40 },
  quizScroll: { padding: 20, gap: 16, paddingTop: 24, paddingBottom: 40 },
  backBtn: { alignSelf: 'flex-start' },
  backBtnText: { color: '#22b5ff', fontWeight: '700', fontSize: 15 },
  lessonHeader: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  categoryBadge: {
    backgroundColor: '#22b5ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: { fontSize: 12, fontWeight: '800', color: '#001a41' },
  sourceBadge: {
    backgroundColor: '#BFFFA1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sourceText: { fontSize: 12, fontWeight: '700', color: '#001a41' },
  lessonTitle: { fontSize: 22, fontWeight: '900', color: '#fff', lineHeight: 30 },
  lessonBody: { fontSize: 15, color: '#ccc', lineHeight: 24 },
  resumeBanner: {
    backgroundColor: '#002e69',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#22b5ff',
    padding: 16,
    gap: 10,
  },
  resumeTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  resumeText: { fontSize: 13, color: '#22b5ff', fontWeight: '600' },
  resumeActions: { flexDirection: 'row', gap: 10 },
  resumeBtn: {
    flex: 1,
    backgroundColor: '#22b5ff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  resumeBtnText: { fontSize: 14, fontWeight: '800', color: '#001a41' },
  restartBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334',
  },
  restartBtnText: { fontSize: 14, fontWeight: '700', color: '#aaa' },
  bugsyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#002e69',
    borderRadius: 12,
    padding: 14,
  },
  bugsyHintEmoji: { fontSize: 32 },
  bugsyHintText: { flex: 1, color: '#fff', fontWeight: '600', fontSize: 14 },
  readyBtn: {
    backgroundColor: '#22b5ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001a41',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  readyBtnText: { fontSize: 18, fontWeight: '800', color: '#001a41' },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 60,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334',
  },
  progressDotActive: { width: 24, backgroundColor: '#22b5ff' },
  progressDotDone: { backgroundColor: '#BFFFA1' },
  warmupBanner: {
    backgroundColor: '#001a41',
    borderWidth: 2,
    borderColor: '#22b5ff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  warmupText: { color: '#22b5ff', fontWeight: '700', fontSize: 13 },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#22b5ff',
    padding: 20,
    gap: 10,
    shadowColor: '#22b5ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 6,
  },
  questionCardWarmup: { borderColor: '#90caf9' },
  questionCounter: { fontSize: 12, fontWeight: '700', color: '#888' },
  questionText: { fontSize: 17, fontWeight: '800', color: '#001a41', lineHeight: 24 },
  options: { gap: 12 },
  optionBtn: {
    backgroundColor: '#002e69',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 3,
  },
  optionCorrect: { backgroundColor: '#2d7a2d', borderColor: '#BFFFA1' },
  optionWrong: { backgroundColor: '#ba1a1a', borderColor: '#ff9999' },
  optionCorrectHint: { borderColor: '#BFFFA1', borderWidth: 2 },
  optionText: { fontSize: 15, fontWeight: '700', color: '#fff' },
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
  storyText: { fontSize: 14, color: '#ccc', lineHeight: 21 },
  ruleBox: { backgroundColor: '#BFFFA1', borderRadius: 12, padding: 16, gap: 6 },
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
  summaryTitle: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center' },
  summaryScore: { fontSize: 16, color: '#22b5ff', fontWeight: '700', textAlign: 'center' },
  cheatSheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#22b5ff',
    padding: 20,
    gap: 16,
  },
  cheatSheetTitle: { fontSize: 16, fontWeight: '900', color: '#001a41', textAlign: 'center' },
  cheatSection: { gap: 6 },
  cheatRealWorld: {
    backgroundColor: '#BFFFA1',
    borderRadius: 10,
    padding: 12,
  },
  cheatSectionTitle: { fontSize: 14, fontWeight: '800', color: '#001a41' },
  cheatItem: { fontSize: 13, color: '#333', lineHeight: 20 },
  rewardRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  rewardBadge: {
    backgroundColor: '#FFB000',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  qpReward: { backgroundColor: '#00A8A8' },
  rewardText: { fontSize: 16, fontWeight: '800', color: '#001a41' },
});

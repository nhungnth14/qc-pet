import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SlideUpPanel } from '@/components';
import { useSessionStore } from '@/stores/session-store';
import { submitRetrospective } from '../retrospective-api';
import { useSprintStore } from '../stores/use-sprint-store';

type RetrospectivePanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QUESTIONS = [
  'Điều gì bạn đã áp dụng được từ sprint này?',
  'Điều gì vẫn còn khó?',
  'Tuần tới bạn muốn bật/tắt gì?',
];

/**
 * Retrospective panel (Story 7.5). 3 câu hỏi freeform — answer 1/2/cả 3 (không bắt buộc).
 * "Lưu suy nghĩ" (save partial) | "Bỏ qua" (skip, không lưu). Optional — không penalize.
 */
export function RetrospectivePanel({ isOpen, onClose }: RetrospectivePanelProps) {
  const userId = useSessionStore(s => s.userId);
  const sprintNumber = useSprintStore(s => s.sprintNumber);
  const [applied, setApplied] = useState('');
  const [stillHard, setStillHard] = useState('');
  const [nextToggle, setNextToggle] = useState('');
  const [busy, setBusy] = useState(false);

  const onSave = async () => {
    if (busy || !userId)
      return;
    setBusy(true);
    try {
      await submitRetrospective(userId, sprintNumber, { applied, stillHard, nextToggle });
      onClose();
    }
    catch {
      // giữ panel để thử lại
    }
    finally {
      setBusy(false);
    }
  };

  const setters = [setApplied, setStillHard, setNextToggle];
  const values = [applied, stillHard, nextToggle];

  return (
    <SlideUpPanel isOpen={isOpen} onClose={onClose} snapPoints={['70%']}>
      <View style={styles.wrap}>
        <Text style={styles.title}>{`Retrospective · Sprint #${sprintNumber}`}</Text>
        {QUESTIONS.map((q, i) => (
          <View key={q} style={styles.field}>
            <Text style={styles.q}>{q}</Text>
            <TextInput
              style={styles.input}
              value={values[i]}
              onChangeText={setters[i]}
              placeholder="(không bắt buộc)"
              placeholderTextColor="#8a97ab"
              multiline
              accessibilityLabel={q}
            />
          </View>
        ))}
        <Pressable
          style={[styles.save, busy && styles.disabled]}
          onPress={onSave}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Lưu suy nghĩ"
        >
          <Text style={styles.saveText}>{busy ? 'Đang lưu...' : 'Lưu suy nghĩ'}</Text>
        </Pressable>
        <Pressable
          style={styles.skip}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Bỏ qua retrospective"
        >
          <Text style={styles.skipText}>Bỏ qua</Text>
        </Pressable>
      </View>
    </SlideUpPanel>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 8, gap: 12 },
  title: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  field: { gap: 6 },
  q: { fontSize: 14, fontWeight: '700', color: '#001a41' },
  input: {
    minHeight: 56,
    borderWidth: 2,
    borderColor: '#001a41',
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    color: '#001a41',
    textAlignVertical: 'top',
  },
  save: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006491',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#001a41',
  },
  disabled: { opacity: 0.45 },
  saveText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  skip: { minHeight: 44, alignItems: 'center', justifyContent: 'center', padding: 10 },
  skipText: { fontSize: 14, fontWeight: '700', color: '#3a4a66' },
});

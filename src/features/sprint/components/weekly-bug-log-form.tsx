import type { BugOutcome, BugPriority, BugSeverity } from '../weekly-bug-log';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSessionStore } from '@/stores/session-store';
import { OUTCOME_OPTIONS, PRIORITY_OPTIONS, SEVERITY_OPTIONS } from '../weekly-bug-log';
import { submitWeeklyBugLog } from '../weekly-bug-log-api';

type ChipRowProps = {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
};

function ChipRow({ label, options, value, onSelect }: ChipRowProps) {
  return (
    <View style={styles.chipRow}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map(o => (
          <Pressable
            key={o}
            style={[styles.chip, value === o && styles.chipActive]}
            onPress={() => onSelect(o)}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${o}`}
          >
            <Text style={[styles.chipText, value === o && styles.chipTextActive]}>{o}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** Weekly Bug Log form (Story 7.3). Honor system — không validate nội dung. */
export function WeeklyBugLogForm({ onDone }: { onDone: () => void }) {
  const userId = useSessionStore(s => s.userId);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('Medium');
  const [priority, setPriority] = useState<BugPriority>('Medium');
  const [outcome, setOutcome] = useState<BugOutcome>('Still Open');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (busy || !userId)
      return;
    setBusy(true);
    try {
      await submitWeeklyBugLog(userId, { description: description.trim(), severity, priority, outcome });
      onDone();
    }
    catch {
      // giữ form để thử lại
    }
    finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Ghi lại bug tuần này</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả bug (không bị chấm điểm)..."
        placeholderTextColor="#8a97ab"
        multiline
        accessibilityLabel="Mô tả bug"
      />
      <ChipRow label="Severity" options={SEVERITY_OPTIONS} value={severity} onSelect={v => setSeverity(v as BugSeverity)} />
      <ChipRow label="Priority" options={PRIORITY_OPTIONS} value={priority} onSelect={v => setPriority(v as BugPriority)} />
      <ChipRow label="Outcome" options={OUTCOME_OPTIONS} value={outcome} onSelect={v => setOutcome(v as BugOutcome)} />
      <Pressable
        style={[styles.submit, busy && styles.disabled]}
        onPress={onSubmit}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel="Lưu bug"
      >
        <Text style={styles.submitText}>{busy ? 'Đang gửi...' : 'Lưu bug'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  title: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  input: {
    minHeight: 72,
    borderWidth: 2,
    borderColor: '#001a41',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#001a41',
    textAlignVertical: 'top',
  },
  chipRow: { gap: 6 },
  chipLabel: { fontSize: 13, fontWeight: '800', color: '#001a41' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#001a41',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#006491' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#001a41' },
  chipTextActive: { color: '#fff' },
  submit: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006491',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#001a41',
  },
  disabled: { opacity: 0.45 },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

import type { BugReportDraft, BugSeverity } from '../side-quest-types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { emptyBugReport, isBugReportComplete } from '../side-quest-types';

type Props = {
  disabled?: boolean;
  onSubmit: (draft: BugReportDraft) => void;
};

const SEVERITIES: { value: BugSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const FIELDS: { key: keyof Omit<BugReportDraft, 'severity'>; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Tiêu đề (Title)', placeholder: 'Mô tả ngắn gọn lỗi…' },
  { key: 'steps', label: 'Các bước (Steps)', placeholder: '1. … 2. … 3. …', multiline: true },
  { key: 'expected', label: 'Kỳ vọng (Expected)', placeholder: 'Lẽ ra phải…', multiline: true },
  { key: 'actual', label: 'Thực tế (Actual)', placeholder: 'Nhưng thực tế…', multiline: true },
];

/**
 * Bug report form (Story 5.6) — dùng chung Bug Hunt + Simulated Bug Hunt. Honor system:
 * KHÔNG chấm nội dung, chỉ chặn submit khi field rỗng (OQ#4). Nút disable tới khi đủ field.
 */
export function BugReportForm({ disabled = false, onSubmit }: Props) {
  const [draft, setDraft] = useState<BugReportDraft>(emptyBugReport);

  const setField = (key: keyof BugReportDraft, value: string | BugSeverity) => {
    if (disabled)
      return;
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const complete = isBugReportComplete(draft);

  return (
    <View style={styles.wrap}>
      {FIELDS.map(f => (
        <View key={f.key} style={styles.fieldRow}>
          <Text style={styles.label}>{f.label}</Text>
          <TextInput
            style={[styles.input, f.multiline && styles.inputMultiline]}
            placeholder={f.placeholder}
            placeholderTextColor="#9aa7bd"
            value={draft[f.key]}
            onChangeText={t => setField(f.key, t)}
            editable={!disabled}
            multiline={f.multiline}
            accessibilityLabel={f.label}
          />
        </View>
      ))}

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Mức độ (Severity)</Text>
        <View style={styles.severityRow}>
          {SEVERITIES.map(s => (
            <Pressable
              key={s.value}
              style={[styles.sevChip, draft.severity === s.value && styles.sevChipActive]}
              disabled={disabled}
              onPress={() => setField('severity', s.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: draft.severity === s.value }}
              accessibilityLabel={`Severity ${s.label}`}
            >
              <Text style={[styles.sevText, draft.severity === s.value && styles.sevTextActive]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        style={[styles.submitBtn, (!complete || disabled) && styles.submitBtnDisabled]}
        disabled={!complete || disabled}
        onPress={() => onSubmit(draft)}
        accessibilityRole="button"
        accessibilityLabel="Gửi báo cáo bug"
      >
        <Text style={styles.submitText}>Gửi báo cáo ✓</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  fieldRow: { gap: 6 },
  label: { fontSize: 13, fontWeight: '800', color: '#001a41' },
  input: {
    minHeight: 46,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#001a41',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#001a41',
    textAlignVertical: 'top',
  },
  inputMultiline: { minHeight: 64 },
  severityRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sevChip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  sevChipActive: { backgroundColor: '#22b5ff' },
  sevText: { fontSize: 13, fontWeight: '800', color: '#001a41' },
  sevTextActive: { color: '#001a41' },
  submitBtn: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006491',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 14,
  },
  submitBtnDisabled: { backgroundColor: '#b6c2d4', borderColor: '#7c8aa0' },
  submitText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

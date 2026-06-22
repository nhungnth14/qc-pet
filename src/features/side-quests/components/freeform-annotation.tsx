import type { FreeformDraft } from '../side-quest-types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { isFreeformComplete } from '../side-quest-types';

type Props = {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (draft: FreeformDraft) => void;
};

/**
 * Freeform annotation (Story 5.6) — dùng chung Peer Review + Repro Steps. 1 ô text dài.
 * Honor system: chỉ chặn submit khi rỗng (OQ#4).
 */
export function FreeformAnnotation({ label, placeholder, disabled = false, onSubmit }: Props) {
  const [text, setText] = useState('');
  const complete = isFreeformComplete({ text });

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9aa7bd"
        value={text}
        onChangeText={t => !disabled && setText(t)}
        editable={!disabled}
        multiline
        accessibilityLabel={label}
      />
      <Pressable
        style={[styles.submitBtn, (!complete || disabled) && styles.submitBtnDisabled]}
        disabled={!complete || disabled}
        onPress={() => onSubmit({ text })}
        accessibilityRole="button"
        accessibilityLabel="Gửi bài làm"
      >
        <Text style={styles.submitText}>Gửi ✓</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  label: { fontSize: 13, fontWeight: '800', color: '#001a41' },
  input: {
    minHeight: 120,
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

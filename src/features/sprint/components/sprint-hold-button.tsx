import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SlideUpPanel } from '@/components';
import { clock } from '@/shared/lib/clock';
import { useSessionStore } from '@/stores/session-store';
import { dateKeyUTC7 } from '../date-key';
import { canUseSprintHold } from '../sprint-hold';
import { submitSprintHold } from '../sprint-hold-api';
import { useSprintStore } from '../stores/use-sprint-store';

/**
 * Sprint Hold button + reason panel (Story 7.4). Pause streak 1 ngày (reason bắt buộc). Disabled khi
 * 0 token hoặc đã hold hôm qua (không 2 ngày liên tiếp). Token earn qua cron (defer).
 */
export function SprintHoldButton() {
  const userId = useSessionStore(s => s.userId);
  const holdTokens = useSprintStore(s => s.holdTokens);
  const lastHoldDateKey = useSprintStore(s => s.lastHoldDateKey);
  const consumeToken = useSprintStore(s => s.useHoldToken);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const today = dateKeyUTC7(clock.now());
  const eligible = canUseSprintHold(holdTokens, lastHoldDateKey, today);
  const canSubmit = !busy && !!userId && reason.trim().length > 0 && eligible;

  const onSubmit = async () => {
    if (!canSubmit || !userId)
      return;
    setBusy(true);
    try {
      await submitSprintHold(userId, reason.trim());
      consumeToken();
      setDone(true);
      setReason('');
    }
    catch {
      // giữ panel để thử lại
    }
    finally {
      setBusy(false);
    }
  };

  let body;
  if (done) {
    body = <Text style={styles.note}>Đã dùng Sprint Hold hôm nay — nghỉ ngơi nhé! 🌿</Text>;
  }
  else if (!eligible) {
    body = (
      <Text style={styles.note}>
        {holdTokens <= 0
          ? 'Bạn chưa có Sprint Hold token. Hoàn thành ≥20 nhiệm vụ/tháng để nhận! 🎁'
          : 'Không thể dùng Sprint Hold 2 ngày liên tiếp.'}
      </Text>
    );
  }
  else {
    body = (
      <View style={styles.form}>
        <Text style={styles.title}>Dùng Sprint Hold</Text>
        <Text style={styles.note}>Lý do nghỉ (bắt buộc) — không bị phạt BC hôm nay.</Text>
        <TextInput
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder="Vd: bận công việc, ốm, đi du lịch..."
          placeholderTextColor="#8a97ab"
          accessibilityLabel="Lý do dùng Sprint Hold"
        />
        <Pressable
          style={[styles.submit, !canSubmit && styles.disabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel="Xác nhận dùng Sprint Hold"
        >
          <Text style={styles.submitText}>{busy ? 'Đang xử lý...' : 'Xác nhận'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Pressable
        style={styles.btn}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Dùng Sprint Hold — còn ${holdTokens} token`}
      >
        <Text style={styles.btnText}>{`⏸ Sprint Hold · ${holdTokens} token`}</Text>
      </Pressable>
      <SlideUpPanel isOpen={open} onClose={() => setOpen(false)} snapPoints={['45%']}>
        <View style={styles.panel}>{body}</View>
      </SlideUpPanel>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnText: { fontSize: 13, fontWeight: '700', color: '#001a41' },
  panel: { padding: 8, gap: 12 },
  form: { gap: 12 },
  title: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  note: { fontSize: 14, fontWeight: '600', color: '#3a4a66', lineHeight: 20 },
  input: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: '#001a41',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#001a41',
  },
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

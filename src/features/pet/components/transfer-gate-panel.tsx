import type { PetVersion } from '../evolution';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SlideUpPanel } from '@/components';
import { rewardEventBus } from '@/lib/reward-event-bus';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { EVOLUTION_LABELS } from '../evolution';
import { useSouvenirStore } from '../stores/use-souvenir-store';
import { canEvolve, EVIDENCE_REQUIREMENTS } from '../transfer-gate';
import { evolvePet, submitEvidence } from '../transfer-gate-api';

type TransferGatePanelProps = {
  visible: boolean;
  onClose: () => void;
  nextVersion: PetVersion;
  qpReached: boolean;
};

/**
 * Transfer Gate panel (Story 7.1). Nhập evidence (text, honor system) → submit. Nếu đủ QP →
 * evolve (version bump + souvenir + RewardEventBus → Bugsy excited). Chưa đủ QP → lưu evidence.
 */
// eslint-disable-next-line max-lines-per-function -- panel: form + 2 success states + submit/evolve orchestration; tách nhỏ làm rối.
export function TransferGatePanel({ visible, onClose, nextVersion, qpReached }: TransferGatePanelProps) {
  const userId = useSessionStore(s => s.userId);
  const setVersion = usePetStore(s => s.setVersion);
  const unlockSouvenir = useSouvenirStore(s => s.unlock);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<'evolved' | 'saved' | null>(null);

  const requirement = EVIDENCE_REQUIREMENTS[nextVersion]?.requirement ?? 'Gửi bằng chứng công việc thực';
  const canSubmit = !busy && !!userId && text.trim().length > 0;

  const onSubmit = async () => {
    if (!canSubmit || !userId)
      return;
    setBusy(true);
    try {
      await submitEvidence(userId, nextVersion, text.trim());
      if (canEvolve(qpReached, true)) {
        await evolvePet(userId, nextVersion);
        rewardEventBus.emit('server_committed', { type: 'evolution' });
        rewardEventBus.emit('animation_triggered', { type: 'evolution' });
        setVersion(nextVersion);
        unlockSouvenir(nextVersion);
        setDone('evolved');
      }
      else {
        setDone('saved');
      }
      setText('');
    }
    catch {
      // giữ panel để user thử lại (offline / lỗi server)
    }
    finally {
      setBusy(false);
    }
  };

  let body;
  if (done === 'evolved') {
    body = <Text style={styles.success}>{`🎉 Bugsy đã tiến hóa thành ${EVOLUTION_LABELS[nextVersion]}!`}</Text>;
  }
  else if (done === 'saved') {
    body = <Text style={styles.success}>Đã lưu bằng chứng! Bugsy sẽ tiến hóa khi đủ QP. 🌱</Text>;
  }
  else {
    body = (
      <View style={styles.form}>
        <Text style={styles.title}>{`Transfer Gate → ${EVOLUTION_LABELS[nextVersion]}`}</Text>
        <Text style={styles.req}>{requirement}</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Mô tả bằng chứng của bạn (honor system — không bị chấm điểm)..."
          placeholderTextColor="#8a97ab"
          multiline
          accessibilityLabel="Nhập bằng chứng Transfer Gate"
        />
        <Pressable
          style={[styles.submit, !canSubmit && styles.disabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel="Gửi bằng chứng"
        >
          <Text style={styles.submitText}>{busy ? 'Đang gửi...' : 'Gửi bằng chứng'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SlideUpPanel isOpen={visible} onClose={onClose} snapPoints={['55%']}>
      <View style={styles.wrap}>{body}</View>
    </SlideUpPanel>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 8, gap: 12 },
  form: { gap: 12 },
  title: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  req: { fontSize: 14, fontWeight: '600', color: '#3a4a66', lineHeight: 20 },
  input: {
    minHeight: 96,
    borderWidth: 2,
    borderColor: '#001a41',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#001a41',
    textAlignVertical: 'top',
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
  success: { fontSize: 16, fontWeight: '800', color: '#001a41', textAlign: 'center', paddingVertical: 24 },
});

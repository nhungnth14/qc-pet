import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Image } from '@/components/ui/image';
import { BUGSY_IMAGE } from '@/features/pet/bugsy-asset';
import { updateNeedBars } from '@/lib/supabase-api';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { buildShareText, SHARE_HAPPINESS_REWARD } from '../sprint-demo-card';
import { useSprintStore } from '../stores/use-sprint-store';

/**
 * Sprint Demo Card (Story 7.6) — Phòng Khách. Hiển thị thành quả sprint + native share (text).
 * Share thành công → happiness +50% (clamp). Gradient/image-share/48h-gating → defer.
 */
export function SprintDemoCard() {
  const sprintNumber = useSprintStore(s => s.sprintNumber);
  const streakDays = useSprintStore(s => s.streakDays);
  const version = usePetStore(s => s.version);
  const happiness = usePetStore(s => s.needBars.happiness);
  const setNeedBars = usePetStore(s => s.setNeedBars);
  const userId = useSessionStore(s => s.userId);
  const [shared, setShared] = useState(false);

  const onShare = async () => {
    try {
      const result = await Share.share({ message: buildShareText(sprintNumber) });
      if (result.action === Share.sharedAction && userId) {
        const next = Math.min(100, happiness + SHARE_HAPPINESS_REWARD);
        await updateNeedBars(userId, { happiness: next });
        setNeedBars({ happiness: next });
        setShared(true);
      }
    }
    catch {
      // user huỷ / lỗi share — bỏ qua
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{`🏆 Thành quả Sprint #${sprintNumber}`}</Text>
      <Image source={BUGSY_IMAGE} style={styles.bugsy} contentFit="contain" />
      <View style={styles.stats}>
        <Text style={styles.stat}>{`🔥 Streak: ${streakDays} ngày`}</Text>
        <Text style={styles.stat}>{`🐣 ${version}`}</Text>
      </View>
      <Pressable
        style={styles.share}
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel="Chia sẻ thành quả sprint"
      >
        <Text style={styles.shareText}>{shared ? 'Đã chia sẻ! +50% 😊' : 'Chia sẻ 📤'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFD1BA',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  title: { fontSize: 16, fontWeight: '900', color: '#001a41' },
  bugsy: { width: 128, height: 128 },
  stats: { flexDirection: 'row', gap: 16 },
  stat: { fontSize: 13, fontWeight: '700', color: '#001a41' },
  share: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#006491',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#001a41',
  },
  shareText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

import type { MirrorTier } from '../mirror';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from '@/components/ui/image';
import { BUGSY_IMAGE } from '@/features/pet/bugsy-asset';

type MirrorMomentProps = {
  tier: MirrorTier;
  onDone: () => void;
};

const DURATION_MS = 2500;

/**
 * Mirror Moment (Story 8.3). Bugsy + reflection lật side-by-side, visual theo Discipline tier.
 * 2.5s self-dismiss; KHÔNG tap-dismiss, KHÔNG text overlay (sparkles emoji = decor).
 */
export function MirrorMoment({ tier, onDone }: MirrorMomentProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <View style={[styles.overlay, tier === 'tired' && styles.dim]} pointerEvents="none">
      {tier === 'sparkle' && <Text style={styles.sparkles}>✨   ✨   ✨</Text>}
      <View style={styles.mirror}>
        <Image source={BUGSY_IMAGE} style={styles.bugsy} contentFit="contain" />
        <Image source={BUGSY_IMAGE} style={[styles.bugsy, styles.flipped]} contentFit="contain" />
      </View>
      {tier === 'sparkle' && <Text style={styles.sparkles}>✨   ✨   ✨</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 25,
  },
  dim: { backgroundColor: '#b8c4c3' },
  mirror: { flexDirection: 'row', alignItems: 'center' },
  bugsy: { width: 120, height: 120 },
  flipped: { transform: [{ scaleX: -1 }], opacity: 0.85 },
  sparkles: { fontSize: 24, letterSpacing: 4 },
});

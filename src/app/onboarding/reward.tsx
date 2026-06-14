import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { supabase } from '@/lib/supabase';
import { addCurrency } from '@/lib/supabase-api';
import { storage } from '@/lib/storage';
import { wal } from '@/lib/wal';

export default function RewardScreen() {
  const router = useRouter();
  const petName = usePetStore((s) => s.name);
  const addBC = usePetStore((s) => s.addBC);
  const addQP = usePetStore((s) => s.addQP);
  const setOnboardingComplete = useSessionStore((s) => s.setOnboardingComplete);
  const userId = useSessionStore((s) => s.userId);

  const [offlineMsg, setOfflineMsg] = useState<string | null>(null);

  const bugsyBounce = useRef(new Animated.Value(0)).current;
  const bcFloat = useRef(new Animated.Value(0)).current;
  const qpFloat = useRef(new Animated.Value(0)).current;
  const bcOpacity = useRef(new Animated.Value(0)).current;
  const qpOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    commitRewardToServer().then(() => startAnimations());
  }, []);

  const commitRewardToServer = async () => {
    wal.write('onboarding', 'reward', { bc: 10, qp: 6 });

    const petId = storage.getString('pet_id');

    try {
      if (petId) {
        await addCurrency(petId, 10, 6);
      }
      if (userId) {
        await supabase
          .from('game_state')
          .upsert({ user_id: userId, onboarding_completed: true }, { onConflict: 'user_id' });
      }
      wal.delete('onboarding', 'reward');
      setOnboardingComplete(true);
      addBC(10);
      addQP(6);
    } catch (_err) {
      setOfflineMsg('Đã lưu offline, sẽ sync khi có mạng');
      setOnboardingComplete(true);
      addBC(10);
      addQP(6);
    }
  };

  const startAnimations = () => {
    Animated.sequence([
      Animated.spring(bugsyBounce, {
        toValue: -20,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(bcOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(bcFloat, { toValue: -40, duration: 800, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(qpOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(qpFloat, { toValue: -40, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleContinue = () => {
    router.push('/onboarding/sign-up');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎊 Tuyệt vời {petName}!</Text>

      {/* Bugsy bouncing */}
      <Animated.View style={{ transform: [{ translateY: bugsyBounce }] }}>
        <Text style={styles.bugsy}>🐣</Text>
      </Animated.View>

      {/* Floating rewards */}
      <Animated.View
        style={[
          styles.floatBadge,
          styles.bcBadge,
          { opacity: bcOpacity, transform: [{ translateY: bcFloat }] },
        ]}
      >
        <Text style={styles.floatText}>+10 🪲 BC</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.floatBadge,
          styles.qpBadge,
          { opacity: qpOpacity, transform: [{ translateY: qpFloat }] },
        ]}
      >
        <Text style={styles.floatText}>+6 ⭐ QP</Text>
      </Animated.View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Bạn vừa học được:</Text>
        <Text style={styles.summaryPoint}>
          ✅ "Fixed" của dev ≠ bug đã closed
        </Text>
        <Text style={styles.summaryPoint}>
          ✅ Tester phải verify độc lập trước khi close ticket
        </Text>
        <Text style={styles.summaryPoint}>
          ✅ Document lại evidence khi retest
        </Text>
      </View>

      {offlineMsg && <Text style={styles.offlineMsg}>{offlineMsg}</Text>}

      <Pressable style={styles.btn} onPress={handleContinue}>
        <Text style={styles.btnText}>Vào Work Room với Bugsy →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5D9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#001a41',
    textAlign: 'center',
  },
  bugsy: { fontSize: 100 },
  floatBadge: {
    position: 'absolute',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  bcBadge: {
    backgroundColor: '#FFB000',
    top: '42%',
    left: '20%',
  },
  qpBadge: {
    backgroundColor: '#00A8A8',
    top: '42%',
    right: '20%',
  },
  floatText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#001a41',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 20,
    gap: 10,
    width: '100%',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#001a41',
    marginBottom: 4,
  },
  summaryPoint: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    lineHeight: 20,
  },
  offlineMsg: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
    width: '100%',
  },
  btn: {
    backgroundColor: '#006491',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#001a41',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  btnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});

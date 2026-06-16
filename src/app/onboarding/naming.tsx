/* eslint-disable max-lines-per-function */
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  clearNameDraft,
  getNameDraft,
  saveNameDraft,
  setStep,
} from '@/features/onboarding/onboarding-progress';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';

const SUGGESTIONS = ['Bugsy', 'Kiwi', 'Pip'];

export default function NamingScreen() {
  const router = useRouter();
  const savePetLocally = usePetStore(s => s.savePetLocally);
  const userId = useSessionStore(s => s.userId);
  // Resume tên đang gõ dở (Story 2.6 AC1) — khởi tạo từ draft đã lưu trong MMKV.
  const [petName, setPetName] = useState(() => getNameDraft());
  const [selected, setSelected] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const panelAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    setStep('naming');
    Animated.spring(panelAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [panelAnim]);

  // Lưu draft tên đang gõ (ghi MMKV đồng bộ) → force-quit vẫn resume đúng.
  const handleChangeName = (text: string) => {
    setPetName(text);
    saveNameDraft(text);
  };

  const handleSelect = (name: string) => {
    setSelected(name);
    setPetName(name);
    saveNameDraft(name);
  };

  const handleConfirm = async () => {
    if (isSubmitting)
      return;
    setIsSubmitting(true);
    try {
      const name = petName.trim() || 'Bugsy';
      savePetLocally(name);

      if (userId) {
        try {
          const { data } = await supabase
            .from('pets')
            .upsert({ user_id: userId, name }, { onConflict: 'user_id' })
            .select('id')
            .single();
          if (data?.id) {
            storage.set('pet_id', data.id);
          }
        }
        catch {
          // Server write failed — pet saved locally, continues offline
        }
      }

      clearNameDraft();
      router.push('/onboarding/aha-moment');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const isValid = petName.trim().length > 0 && petName.trim().length <= 20;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.bugsyArea}>
        <Text style={styles.bugsy}>🐣</Text>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Mình là ai vậy? 👀</Text>
        </View>
      </View>

      <Animated.View
        style={[styles.panel, { transform: [{ translateY: panelAnim }] }]}
      >
        <Text style={styles.panelTitle}>Đặt tên cho Bugsy</Text>

        {/* Suggestions */}
        <View style={styles.suggestions}>
          {SUGGESTIONS.map(name => (
            <Pressable
              key={name}
              style={[
                styles.chip,
                selected === name && styles.chipSelected,
              ]}
              onPress={() => handleSelect(name)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected === name && styles.chipTextSelected,
                ]}
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Hoặc nhập tên khác..."
          placeholderTextColor="#999"
          value={petName}
          onChangeText={handleChangeName}
          maxLength={20}
          autoCapitalize="words"
        />
        <Text style={styles.charCount}>
          {petName.length}
          /20
        </Text>

        {/* Confirm */}
        <Pressable
          style={[styles.btn, (!isValid || isSubmitting) && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={!isValid || isSubmitting}
        >
          <Text style={styles.btnText}>
            Đặt tên cho
            {' '}
            {petName.trim() || '...'}
            {' '}
            🐣
          </Text>
        </Pressable>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5D9',
    justifyContent: 'flex-end',
  },
  bugsyArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bugsy: { fontSize: 100 },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  speechText: { fontSize: 16, fontWeight: '700', color: '#001a41' },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderWidth: 4,
    borderColor: '#001a41',
    padding: 28,
    gap: 16,
    paddingBottom: 48,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#001a41',
    textAlign: 'center',
  },
  suggestions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 2,
    borderColor: '#001a41',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  chipSelected: { backgroundColor: '#001a41' },
  chipText: { fontSize: 16, fontWeight: '700', color: '#001a41' },
  chipTextSelected: { color: '#fff' },
  input: {
    borderWidth: 2,
    borderColor: '#001a41',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#001a41',
    backgroundColor: '#f8f8f8',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: -8,
  },
  btn: {
    backgroundColor: '#006491',
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
  btnDisabled: { backgroundColor: '#ccc', borderColor: '#999' },
  btnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

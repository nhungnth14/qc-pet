import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';

export default function SignUpScreen() {
  const router = useRouter();
  const petName = usePetStore((s) => s.name);
  const signUpWithEmail = useSessionStore((s) => s.signUpWithEmail);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 6;

  const handleSave = async () => {
    if (!isValid) return;
    setIsLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password);
      router.replace('/(app)');
    } catch (err: any) {
      setError(err?.message ?? 'Đăng ký thất bại, thử lại nhé');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(app)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.top}>
        <Text style={styles.bugsy}>🐣</Text>
        <Text style={styles.title}>Lưu {petName} lại!</Text>
        <Text style={styles.subtitle}>
          Tạo tài khoản để không mất {petName} nếu cài lại app.
        </Text>
      </View>

      <View style={styles.panel}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu (ít nhất 6 ký tự)"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[styles.btnPrimary, (!isValid || isLoading) && styles.btnDisabled]}
          onPress={handleSave}
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>Lưu {petName} 🐣</Text>
          )}
        </Pressable>

        <Pressable style={styles.btnSkip} onPress={handleSkip}>
          <Text style={styles.btnSkipText}>Để sau</Text>
        </Pressable>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Nếu xóa app, bạn sẽ mất {petName} và toàn bộ tiến trình.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5D9',
    justifyContent: 'flex-end',
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  bugsy: { fontSize: 80 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#001a41',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderWidth: 4,
    borderColor: '#001a41',
    padding: 28,
    gap: 14,
    paddingBottom: 48,
  },
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
  errorText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '600',
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: '#22b5ff',
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
  btnPrimaryText: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  btnSkip: {
    alignItems: 'center',
    padding: 12,
  },
  btnSkipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
    textDecorationLine: 'underline',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffc107',
    padding: 12,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#664d03',
    textAlign: 'center',
    lineHeight: 20,
  },
});

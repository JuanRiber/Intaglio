import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { palette, radii } from '../../theme/palette';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !senha.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    const result = await login({ email, senha });
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Nexo</Text>
        <Text style={styles.heroTitle}>Acesse sua conta</Text>
        <Text style={styles.heroText}>Entre para continuar gerenciando seus serviços.</Text>
      </View>

      <View style={styles.card}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#8E897E"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#8E897E"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <PrimaryButton title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} />

        <PrimaryButton
          title="Criar conta"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
          style={{ marginTop: 12 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: 14 }}>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.snow,
    paddingHorizontal: 24,
    justifyContent: 'center'
  },
  hero: {
    marginBottom: 24
  },
  brand: {
    color: palette.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  heroTitle: {
    color: palette.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    marginBottom: 8
  },
  heroText: {
    color: palette.textSoft,
    fontSize: 15,
    lineHeight: 22
  },
  card: {
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radii.lg,
    padding: 18
  },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FCFBF8',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    marginBottom: 12
  },
  error: {
    color: palette.danger,
    marginBottom: 10
  },
  link: {
    textAlign: 'center',
    color: palette.gold,
    fontWeight: '600'
  }
});

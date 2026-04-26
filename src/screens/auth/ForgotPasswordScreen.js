import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { palette, radii } from '../../theme/palette';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Informe seu e-mail.');
      return;
    }
    setLoading(true);
    const result = await requestPasswordReset({ email });
    setLoading(false);
    if (!result.success) setError(result.message);
    else setMessage(result.message);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Nexo</Text>
        <Text style={styles.heroTitle}>Recupere sua senha</Text>
        <Text style={styles.heroText}>Informe seu e-mail cadastrado para receber o link.</Text>
      </View>

      <View style={styles.card}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#8E897E"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton title={loading ? 'Enviando...' : 'Enviar link'} onPress={handleSubmit} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 14 }}>
          <Text style={styles.link}>Voltar</Text>
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
    marginBottom: 20
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
  message: {
    color: palette.success,
    marginBottom: 10
  },
  link: {
    textAlign: 'center',
    color: palette.gold,
    fontWeight: '600'
  }
});

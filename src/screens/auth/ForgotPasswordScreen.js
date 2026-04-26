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

/**
 * ForgotPasswordScreen permite que o usuário solicite a recuperação de sua
 * senha. A lógica de envio é simulada, mas fornece feedback amigável.
 */
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
      setError('Informe seu email.');
      return;
    }
    setLoading(true);
    const result = await requestPasswordReset({ email });
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Recuperar senha</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton
          title={loading ? 'Enviando...' : 'Enviar link de recuperação'}
          onPress={handleSubmit}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  innerContainer: {
    backgroundColor: '#1f1f1f',
    padding: 24,
    borderRadius: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    marginBottom: 12
  },
  error: {
    color: '#e74c3c',
    marginBottom: 8
  },
  message: {
    color: '#2ecc71',
    marginBottom: 8
  },
  link: {
    color: '#006aff',
    textAlign: 'center'
  }
});
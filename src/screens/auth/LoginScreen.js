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

/**
 * LoginScreen permite que o usuário entre na aplicação usando email e senha.
 * Campos são validados de maneira simples e mensagens de erro são exibidas
 * quando o login falha. O usuário pode navegar para cadastro ou
 * recuperação de senha.
 */
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
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Entrar</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#777777"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <PrimaryButton title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} />
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ marginTop: 12 }}
        >
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }}>
          <Text style={styles.link}>Criar conta</Text>
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
  link: {
    color: '#006aff',
    textAlign: 'center'
  }
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { validatePasswordStrength } from '../../utils/security';
import { palette, radii } from '../../theme/palette';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!nome.trim() || !telefone.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Informe um email válido.');
      return;
    }
    const passwordError = validatePasswordStrength(senha);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const result = await register({ nome, telefone, email, senha });
      if (!result.success) setError(result.message || 'Falha ao cadastrar.');
    } catch (err) {
      setError('Não foi possível criar a conta agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.hero}>
          <Text style={styles.brand}>Nexo</Text>
          <Text style={styles.heroTitle}>Crie sua conta</Text>
          <Text style={styles.heroText}>Cadastro simples para começar a usar o app.</Text>
        </View>

        <View style={styles.card}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#8E897E" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="Seu telefone" placeholderTextColor="#8E897E" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
          <TextInput style={styles.input} placeholder="Seu e-mail" placeholderTextColor="#8E897E" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Senha (mín. 8, com letras e números)" placeholderTextColor="#8E897E" secureTextEntry autoComplete="new-password" textContentType="newPassword" value={senha} onChangeText={setSenha} />
          <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#8E897E" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
          <PrimaryButton title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleRegister} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 14 }}>
            <Text style={styles.link}>Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.snow,
    paddingHorizontal: 24
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
  link: {
    textAlign: 'center',
    color: palette.gold,
    fontWeight: '600'
  }
});

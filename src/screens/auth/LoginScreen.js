
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha para entrar.');
      return;
    }

    const response = await login({ email, senha });

    if (!response.success) {
      Alert.alert('Não foi possível entrar', response.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entre no seu palco de organização.</Text>
      <Text style={styles.subtitle}>
        O Nexo guarda serviços, orçamentos e o ritmo do seu faturamento no mesmo lugar.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="voce@exemplo.com"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          secureTextEntry
          placeholder="Sua senha"
          placeholderTextColor={colors.textMuted}
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
        />

        <Pressable onPress={handleLogin} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Criar Conta')} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Criar conta</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Recuperar Senha')}>
          <Text style={styles.linkText}>Esqueci minha senha</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: 24,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 340,
  },
  form: {
    marginTop: 34,
    gap: 12,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.white,
    paddingHorizontal: 14,
  },
  primaryButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});

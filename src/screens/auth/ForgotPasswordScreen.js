
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert('Informe o email', 'Digite o email da conta para continuar.');
      return;
    }

    const response = await requestPasswordReset({ email });

    if (!response.success) {
      Alert.alert('Não foi possível continuar', response.message);
      return;
    }

    Alert.alert('Confirmação enviada', response.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recupere seu acesso.</Text>
      <Text style={styles.subtitle}>
        Nesta versão o envio é simbólico, mas o fluxo já está pronto para a integração real.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="voce@exemplo.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Pressable onPress={handleReset} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Enviar link / código</Text>
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
    marginTop: 16,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 340,
  },
  form: {
    marginTop: 28,
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
});

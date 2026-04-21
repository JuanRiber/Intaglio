import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');

  async function handleRequestReset() {
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o email cadastrado.');
      return;
    }

    const result = await requestPasswordReset({ email });
    Alert.alert(result.success ? 'Solicitação enviada' : 'Não foi possível continuar', result.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <Text style={styles.subtitle}>Informe o email da conta para receber um retorno simbólico de recuperação.</Text>

      <SectionCard>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <PrimaryButton label="Enviar link / código" onPress={handleRequestReset} />
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
    color: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
});

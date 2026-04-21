import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha.');
      return;
    }

    const result = await login({ email, senha });
    if (!result.success) {
      Alert.alert('Não foi possível entrar', result.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <Text style={styles.subtitle}>Acesse sua rotina de serviços, clientes e financeiro em um só lugar.</Text>

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
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <PrimaryButton label="Entrar" onPress={handleLogin} style={styles.actionSpacing} />
        <PrimaryButton label="Criar conta" variant="ghost" onPress={() => navigation.navigate('Cadastro')} style={styles.actionSpacing} />
        <PrimaryButton label="Esqueci minha senha" variant="ghost" onPress={() => navigation.navigate('Recuperar senha')} />
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
  actionSpacing: {
    marginBottom: 10,
  },
});

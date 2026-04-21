
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  function emailValido(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  async function handleRegister() {
    if (!nome.trim() || !telefone.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para criar sua conta.');
      return;
    }

    if (!emailValido(email.trim())) {
      Alert.alert('Email inválido', 'Digite um email válido para continuar.');
      return;
    }

    if (senha.length < 4) {
      Alert.alert('Senha muito curta', 'Use pelo menos 4 caracteres nesta fase inicial.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A confirmação de senha precisa ser igual à senha principal.');
      return;
    }

    await register({ nome, telefone, email, senha });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie sua conta no Nexo.</Text>
      <Text style={styles.subtitle}>
        Comece com o básico agora. O perfil profissional completo entra na próxima fase do projeto.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={nome} onChangeText={setNome} style={styles.input} placeholder="Seu nome" placeholderTextColor={colors.textMuted} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput value={telefone} onChangeText={setTelefone} style={styles.input} placeholder="(85) 99999-9999" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="voce@exemplo.com" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" />

        <Text style={styles.label}>Senha</Text>
        <TextInput value={senha} onChangeText={setSenha} style={styles.input} placeholder="Crie uma senha" placeholderTextColor={colors.textMuted} secureTextEntry />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput value={confirmarSenha} onChangeText={setConfirmarSenha} style={styles.input} placeholder="Repita sua senha" placeholderTextColor={colors.textMuted} secureTextEntry />

        <Pressable onPress={handleRegister} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Cadastrar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
    paddingBottom: 44,
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

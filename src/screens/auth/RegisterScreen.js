import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';
import { formatPhone, normalizePhone } from '../../utils/formatters';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  async function handleRegister() {
    if (!nome.trim() || !telefone.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Informe um email válido.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senha diferente', 'A confirmação de senha precisa ser igual.');
      return;
    }

    await register({ nome, telefone: normalizePhone(telefone), email, senha });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Monte sua base inicial e entre no Nexo com um fluxo simples.</Text>

      <SectionCard>
        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.textMuted} value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor={colors.textMuted} value={telefone} onChangeText={(value) => setTelefone(formatPhone(value))} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={colors.textMuted} value={senha} onChangeText={setSenha} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor={colors.textMuted} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
        <PrimaryButton label="Cadastrar" onPress={handleRegister} />
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

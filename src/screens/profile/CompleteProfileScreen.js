import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../constants/theme';
import { formatPhone, normalizePhone } from '../../utils/formatters';
import { useProfile } from '../../context/ProfileContext';

export default function CompleteProfileScreen() {
  const { saveGaiaProfile } = useProfile();
  const [profissionalNome, setProfissionalNome] = useState('');
  const [negocioNome, setNegocioNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');
  const [logo, setLogo] = useState('');
  const [cobrancaPadrao, setCobrancaPadrao] = useState('Orçamento fechado');

  async function handleSaveProfile() {
    if (!profissionalNome.trim() || !negocioNome.trim() || !especialidade.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome profissional, nome do negócio e especialidade.');
      return;
    }

    await saveGaiaProfile({
      profissionalNome,
      negocioNome,
      especialidade,
      whatsapp: normalizePhone(whatsapp),
      cidade,
      logo,
      cobrancaPadrao,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Completar perfil profissional</Text>
      <Text style={styles.subtitle}>Deixe o Nexo com a sua cara de trabalho e prepare a base da operação.</Text>

      <SectionCard>
        <TextInput style={styles.input} placeholder="Nome do profissional" placeholderTextColor={colors.textMuted} value={profissionalNome} onChangeText={setProfissionalNome} />
        <TextInput style={styles.input} placeholder="Nome do negócio" placeholderTextColor={colors.textMuted} value={negocioNome} onChangeText={setNegocioNome} />
        <TextInput style={styles.input} placeholder="Especialidade" placeholderTextColor={colors.textMuted} value={especialidade} onChangeText={setEspecialidade} />
        <TextInput style={styles.input} placeholder="WhatsApp" placeholderTextColor={colors.textMuted} value={whatsapp} onChangeText={(value) => setWhatsapp(formatPhone(value))} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor={colors.textMuted} value={cidade} onChangeText={setCidade} />
        <TextInput style={styles.input} placeholder="Logo opcional (URL ou nome do arquivo)" placeholderTextColor={colors.textMuted} value={logo} onChangeText={setLogo} />
        <TextInput style={styles.input} placeholder="Forma de cobrança padrão" placeholderTextColor={colors.textMuted} value={cobrancaPadrao} onChangeText={setCobrancaPadrao} />
        <PrimaryButton label="Salvar perfil" onPress={handleSaveProfile} />
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

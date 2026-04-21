import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../constants/theme';
import { useServices } from '../context/ServicesContext';
import { formatPhone, normalizePhone } from '../utils/formatters';

export default function EditServiceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params || {};
  const { services, editService } = useServices();

  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [problema, setProblema] = useState('');
  const [pecas, setPecas] = useState([]);
  const [maoDeObra, setMaoDeObra] = useState('');

  useEffect(() => {
    const targetService = services.find((service) => service.id === serviceId);
    if (!targetService) return;

    setCliente(targetService.cliente || '');
    setTelefone(formatPhone(targetService.telefone || ''));
    setEquipamento(targetService.equipamento || '');
    setProblema(targetService.problema || '');
    setPecas((targetService.pecas || []).map((piece) => ({ descricao: piece.descricao, valor: String(piece.valor) })));
    setMaoDeObra(targetService.maoDeObra != null ? String(targetService.maoDeObra) : '');
  }, [serviceId, services]);

  function addCeridwenPart() {
    setPecas((current) => [...current, { descricao: '', valor: '' }]);
  }

  function updateCeridwenPart(index, field, value) {
    setPecas((current) => current.map((piece, pieceIndex) => (pieceIndex === index ? { ...piece, [field]: value } : piece)));
  }

  function removeCeridwenPart(index) {
    setPecas((current) => current.filter((_, pieceIndex) => pieceIndex !== index));
  }

  function handleSaveChanges() {
    if (!cliente.trim() || !equipamento.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha cliente e equipamento.');
      return;
    }

    editService(serviceId, {
      cliente: cliente.trim(),
      telefone: normalizePhone(telefone),
      equipamento: equipamento.trim(),
      problema: problema.trim(),
      pecas: pecas.map((piece) => ({ descricao: piece.descricao.trim(), valor: parseFloat(piece.valor) || 0 })),
      maoDeObra: parseFloat(maoDeObra) || 0,
    });

    Alert.alert('Alterações salvas', 'O serviço foi atualizado.');
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar serviço</Text>
      <Text style={styles.subtitle}>Ajuste os dados do atendimento sem perder o histórico do fluxo.</Text>

      <TextInput style={styles.input} placeholder="Cliente" placeholderTextColor={colors.textMuted} value={cliente} onChangeText={setCliente} />
      <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor={colors.textMuted} value={telefone} onChangeText={(value) => setTelefone(formatPhone(value))} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Equipamento" placeholderTextColor={colors.textMuted} value={equipamento} onChangeText={setEquipamento} />
      <TextInput style={[styles.input, styles.inputMultiline]} placeholder="Descrição do problema" placeholderTextColor={colors.textMuted} value={problema} onChangeText={setProblema} multiline />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Peças utilizadas</Text>
        <TouchableOpacity onPress={addCeridwenPart} style={styles.addButton}><Text style={styles.addButtonText}>Adicionar peça</Text></TouchableOpacity>
      </View>

      {pecas.map((piece, index) => (
        <View key={String(index)} style={styles.pieceRow}>
          <TextInput style={[styles.input, styles.pieceDescription]} placeholder="Descrição" placeholderTextColor={colors.textMuted} value={piece.descricao} onChangeText={(value) => updateCeridwenPart(index, 'descricao', value)} />
          <TextInput style={[styles.input, styles.pieceValue]} placeholder="Valor" placeholderTextColor={colors.textMuted} value={piece.valor.toString()} onChangeText={(value) => updateCeridwenPart(index, 'valor', value.replace(',', '.'))} keyboardType="numeric" />
          <TouchableOpacity onPress={() => removeCeridwenPart(index)} style={styles.removeButton}><Text style={styles.removeButtonText}>X</Text></TouchableOpacity>
        </View>
      ))}

      <TextInput style={styles.input} placeholder="Valor da mão de obra" placeholderTextColor={colors.textMuted} value={maoDeObra} onChangeText={(value) => setMaoDeObra(value.replace(',', '.'))} keyboardType="numeric" />

      <Pressable style={styles.submitButton} onPress={handleSaveChanges}><Text style={styles.submitButtonText}>Salvar alterações</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: colors.background },
  title: { color: colors.white, fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.textMuted, marginBottom: 18, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.white, borderRadius: 14, padding: 14, marginBottom: 12, fontSize: 16 },
  inputMultiline: { height: 96, textAlignVertical: 'top' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
  addButton: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  pieceRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  pieceDescription: { flex: 1 },
  pieceValue: { width: 92 },
  removeButton: { backgroundColor: colors.danger, paddingHorizontal: 12, paddingVertical: 16, borderRadius: 12 },
  removeButtonText: { color: colors.white, fontWeight: '700' },
  submitButton: { backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  submitButtonText: { color: colors.white, fontWeight: '800', fontSize: 15 },
});

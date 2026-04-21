/*
 * EditServiceScreen.js
 *
 * Esta tela permite editar um serviço existente. Parte do ritual de
 * refinar músicas clássicas: ajustes sutis geram grandes resultados.
 */

import React, { useState, useEffect } from 'react';
import { Text, TextInput, Pressable, StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { useServices } from '../context/ServicesContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../constants/theme';
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
    const service = services.find((svc) => svc.id === serviceId);
    if (service) {
      setCliente(service.cliente || '');
      setTelefone(formatPhone(service.telefone || ''));
      setEquipamento(service.equipamento || '');
      setProblema(service.problema || '');
      setPecas(service.pecas ? service.pecas.map((p) => ({ descricao: p.descricao, valor: p.valor.toString() })) : []);
      setMaoDeObra(service.maoDeObra != null ? service.maoDeObra.toString() : '');
    }
  }, [serviceId, services]);

  function handleAddPeca() {
    setPecas([...pecas, { descricao: '', valor: '' }]);
  }

  function handlePecaChange(index, field, value) {
    const updated = pecas.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setPecas(updated);
  }

  function handleRemovePeca(index) {
    const updated = pecas.filter((_, i) => i !== index);
    setPecas(updated);
  }

  function handleSubmit() {
    if (!cliente.trim() || !equipamento.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome do cliente e o equipamento.');
      return;
    }

    for (const peca of pecas) {
      if (!peca.descricao.trim()) {
        Alert.alert('Peça inválida', 'Todas as peças devem ter uma descrição.');
        return;
      }
      const valorNum = parseFloat(peca.valor);
      if (Number.isNaN(valorNum) || valorNum < 0) {
        Alert.alert('Peça inválida', `Valor inválido para a peça "${peca.descricao}".`);
        return;
      }
    }

    const maoNum = parseFloat(maoDeObra);
    if (maoDeObra && (Number.isNaN(maoNum) || maoNum < 0)) {
      Alert.alert('Valor inválido', 'O valor da mão de obra deve ser um número não negativo.');
      return;
    }

    editService(serviceId, {
      cliente: cliente.trim(),
      telefone: normalizePhone(telefone),
      equipamento: equipamento.trim(),
      problema: problema.trim(),
      pecas: pecas.map((p) => ({ descricao: p.descricao.trim(), valor: parseFloat(p.valor) || 0 })),
      maoDeObra: parseFloat(maoDeObra) || 0,
    });

    Alert.alert('Serviço atualizado', 'As alterações já estão salvas no Nexo.');
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar serviço</Text>
      <Text style={styles.subtitle}>Ajuste o necessário sem quebrar o ritmo do atendimento.</Text>

      <TextInput
        placeholder="Cliente"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        placeholder="Telefone"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={telefone}
        onChangeText={(value) => setTelefone(formatPhone(value))}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Equipamento"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={equipamento}
        onChangeText={setEquipamento}
      />
      <TextInput
        placeholder="Descrição do problema"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.inputMultiline]}
        value={problema}
        onChangeText={setProblema}
        multiline
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Peças utilizadas</Text>
        <TouchableOpacity onPress={handleAddPeca} style={styles.addButton}>
          <Text style={styles.addButtonText}>Adicionar peça</Text>
        </TouchableOpacity>
      </View>

      {pecas.map((peca, index) => (
        <View key={index} style={styles.pecaContainer}>
          <TextInput
            placeholder="Descrição"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.pieceDescription]}
            value={peca.descricao}
            onChangeText={(value) => handlePecaChange(index, 'descricao', value)}
          />
          <TextInput
            placeholder="Valor"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.pieceValue]}
            value={peca.valor.toString()}
            onChangeText={(value) => handlePecaChange(index, 'valor', value.replace(',', '.'))}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => handleRemovePeca(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TextInput
        placeholder="Valor da mão de obra"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={maoDeObra.toString()}
        onChangeText={(value) => setMaoDeObra(value.replace(',', '.'))}
        keyboardType="numeric"
      />

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Salvar alterações</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textMuted,
    marginBottom: 18,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  inputMultiline: {
    height: 96,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  pecaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pieceDescription: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  pieceValue: {
    width: 96,
    marginRight: 8,
    marginBottom: 0,
  },
  removeButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 11,
    paddingVertical: 12,
    borderRadius: 10,
  },
  removeButtonText: {
    color: colors.white,
    fontWeight: '800',
  },
  submitButton: {
    backgroundColor: colors.success,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
});

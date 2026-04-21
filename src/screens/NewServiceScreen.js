/*
 * NewServiceScreen.js
 *
 * Esta tela permite criar um novo serviço, como se estivéssemos compondo
 * "Paranoid" do Black Sabbath: vários riffs (campos) se combinam para
 * construir algo poderoso. Na 0.1.2 o formulário ficou mais limpo e mais
 * confortável para o uso diário.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useServices } from '../context/ServicesContext';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/theme';
import { formatPhone, normalizePhone } from '../utils/formatters';

export default function NewServiceScreen() {
  const { addService } = useServices();
  const navigation = useNavigation();
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [problema, setProblema] = useState('');
  const [pecas, setPecas] = useState([]);
  const [maoDeObra, setMaoDeObra] = useState('');

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

    addService({
      cliente: cliente.trim(),
      telefone: normalizePhone(telefone),
      equipamento: equipamento.trim(),
      problema: problema.trim(),
      pecas: pecas.map((p) => ({ descricao: p.descricao.trim(), valor: parseFloat(p.valor) || 0 })),
      maoDeObra: parseFloat(maoDeObra) || 0,
    });

    Alert.alert('Serviço salvo', 'O novo serviço entrou no fluxo do Nexo.');
    navigation.navigate('Home');
    setCliente('');
    setTelefone('');
    setEquipamento('');
    setProblema('');
    setPecas([]);
    setMaoDeObra('');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo serviço</Text>
      <Text style={styles.subtitle}>Registre o essencial e deixe o resto seguir no compasso do app.</Text>

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
        <Text style={styles.submitButtonText}>Salvar serviço</Text>
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

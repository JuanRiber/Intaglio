/*
 * NewServiceScreen.js
 *
 * Esta tela permite criar um novo serviço, como se estivéssemos compondo
 * "Paranoid" do Black Sabbath: vários riffs (campos) se combinam para
 * construir algo poderoso. O formulário captura cliente, telefone,
 * equipamento, descrição do problema, peças usadas e valor da mão de obra.
 * Ao salvar, adicionamos o serviço à lista com status "aguardando".
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useServices } from '../context/ServicesContext';
import { useNavigation } from '@react-navigation/native';

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
    // Validação
    if (!cliente.trim() || !equipamento.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome do cliente e o equipamento.');
      return;
    }
    // Validação de peças: todas precisam ter descrição e valor numérico
    for (const peca of pecas) {
      if (!peca.descricao.trim()) {
        Alert.alert('Peça inválida', 'Todas as peças devem ter uma descrição.');
        return;
      }
      const valorNum = parseFloat(peca.valor);
      if (isNaN(valorNum) || valorNum < 0) {
        Alert.alert('Peça inválida', `Valor inválido para a peça "${peca.descricao}".`);
        return;
      }
    }
    // Validação do valor da mão de obra
    const maoNum = parseFloat(maoDeObra);
    if (maoDeObra && (isNaN(maoNum) || maoNum < 0)) {
      Alert.alert('Valor inválido', 'O valor da mão de obra deve ser um número não negativo.');
      return;
    }

    addService({
      cliente: cliente.trim(),
      telefone: telefone.trim(),
      equipamento: equipamento.trim(),
      problema: problema.trim(),
      pecas: pecas.map((p) => ({ descricao: p.descricao.trim(), valor: parseFloat(p.valor) || 0 })),
      maoDeObra: parseFloat(maoDeObra) || 0,
    });
    navigation.navigate('Home');
    // Resetar formulário
    setCliente('');
    setTelefone('');
    setEquipamento('');
    setProblema('');
    setPecas([]);
    setMaoDeObra('');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar novo serviço</Text>
      <TextInput
        placeholder="Cliente"
        style={styles.input}
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        placeholder="Telefone"
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Equipamento"
        style={styles.input}
        value={equipamento}
        onChangeText={setEquipamento}
      />
      <TextInput
        placeholder="Descrição do problema"
        style={[styles.input, { height: 80 }]}
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
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={peca.descricao}
            onChangeText={(value) => handlePecaChange(index, 'descricao', value)}
          />
          <TextInput
            placeholder="Valor"
            style={[styles.input, { width: 80, marginRight: 8 }]}
            value={peca.valor.toString()}
            onChangeText={(value) => handlePecaChange(index, 'valor', value)}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => handleRemovePeca(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TextInput
        placeholder="Valor da mão de obra"
        style={styles.input}
        value={maoDeObra.toString()}
        onChangeText={setMaoDeObra}
        keyboardType="numeric"
      />
      <Button title="Salvar serviço" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  pecaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#cc0000',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
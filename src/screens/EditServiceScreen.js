/*
 * EditServiceScreen.js
 *
 * Esta tela permite editar um serviço existente. Parte do ritual de
 * refinar músicas clássicas: ajustes sutis geram grandes resultados.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useServices } from '../context/ServicesContext';
import { useNavigation, useRoute } from '@react-navigation/native';

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
    // Carrega os dados do serviço para edição
    const service = services.find((svc) => svc.id === serviceId);
    if (service) {
      setCliente(service.cliente || '');
      setTelefone(service.telefone || '');
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
    // Validação básica
    if (!cliente.trim() || !equipamento.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome do cliente e o equipamento.');
      return;
    }
    // Converte valores
    const formattedPecas = pecas.map((p) => ({ descricao: p.descricao, valor: parseFloat(p.valor) || 0 }));
    const formattedMaoDeObra = parseFloat(maoDeObra) || 0;

    editService(serviceId, {
      cliente: cliente.trim(),
      telefone: telefone.trim(),
      equipamento: equipamento.trim(),
      problema: problema.trim(),
      pecas: formattedPecas,
      maoDeObra: formattedMaoDeObra,
    });
    // Volta para a tela de detalhes do serviço
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar serviço</Text>
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
      <Button title="Salvar alterações" onPress={handleSubmit} />
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
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices } from '../../context/ServicesContext';
import PrimaryButton from '../../components/PrimaryButton';

/**
 * NewServiceScreen permite cadastrar um novo serviço. O usuário informa
 * dados do cliente, equipamento, problema, peças utilizadas e valor da
 * mão de obra. Os campos são validados antes de salvar.
 */
export default function NewServiceScreen() {
  const navigation = useNavigation();
  const { addService } = useServices();
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [equipment, setEquipment] = useState('');
  const [problem, setProblem] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [parts, setParts] = useState([{ description: '', price: '' }]);
  const [error, setError] = useState('');

  const addPartRow = () => {
    setParts((prev) => [...prev, { description: '', price: '' }]);
  };

  const updatePart = (index, field, value) => {
    setParts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePart = (index) => {
    setParts((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    setError('');
    if (!clientName.trim() || !equipment.trim()) {
      setError('Cliente e equipamento são obrigatórios.');
      return;
    }
    // Validate parts: description and price numeric
    for (let part of parts) {
      if (!part.description.trim()) {
        setError('Todas as peças precisam de descrição.');
        return;
      }
      const price = parseFloat(part.price);
      if (isNaN(price) || price < 0) {
        setError('Preço das peças deve ser um número válido.');
        return;
      }
    }
    const labourNumber = parseFloat(labourCost);
    if (isNaN(labourNumber) || labourNumber < 0) {
      setError('Valor da mão de obra deve ser um número válido.');
      return;
    }
    addService({ clientName, phone, equipment, problem, parts, labourCost });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Novo serviço</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Cliente"
          placeholderTextColor="#777777"
          value={clientName}
          onChangeText={setClientName}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone (opcional)"
          placeholderTextColor="#777777"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Equipamento"
          placeholderTextColor="#777777"
          value={equipment}
          onChangeText={setEquipment}
        />
        <TextInput
          style={[styles.input, { height: 80 } ]}
          placeholder="Descrição do problema"
          placeholderTextColor="#777777"
          multiline
          value={problem}
          onChangeText={setProblem}
        />
        <Text style={styles.sectionTitle}>Peças utilizadas</Text>
        {parts.map((part, idx) => (
          <View key={idx} style={styles.partRow}>
            <TextInput
              style={[styles.input, { flex: 3, marginRight: 4 }]}
              placeholder="Descrição"
              placeholderTextColor="#777777"
              value={part.description}
              onChangeText={(text) => updatePart(idx, 'description', text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="R$"
              placeholderTextColor="#777777"
              keyboardType="decimal-pad"
              value={part.price}
              onChangeText={(text) => updatePart(idx, 'price', text)}
            />
            {parts.length > 1 && (
              <TouchableOpacity onPress={() => removePart(idx)} style={styles.removePartButton}>
                <Text style={styles.removePartText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={addPartRow} style={styles.addPartButton}>
          <Text style={styles.addPartText}>+ Adicionar peça</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Valor da mão de obra"
          placeholderTextColor="#777777"
          keyboardType="decimal-pad"
          value={labourCost}
          onChangeText={setLabourCost}
        />
        <PrimaryButton title="Salvar" onPress={handleSave} style={{ marginTop: 16 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 16
  },
  innerContainer: {
    paddingVertical: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    marginBottom: 12
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  addPartButton: {
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  addPartText: {
    color: '#006aff',
    fontSize: 14
  },
  removePartButton: {
    marginLeft: 4,
    padding: 4
  },
  removePartText: {
    color: '#e74c3c',
    fontSize: 20
  },
  error: {
    color: '#e74c3c',
    marginBottom: 8
  }
});
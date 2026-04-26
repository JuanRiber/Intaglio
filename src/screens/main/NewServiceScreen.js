import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices } from '../../context/ServicesContext';
import PrimaryButton from '../../components/PrimaryButton';
import { palette, radii } from '../../theme/palette';

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

  const addPartRow = () => setParts((prev) => [...prev, { description: '', price: '' }]);

  const updatePart = (index, field, value) => {
    setParts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removePart = (index) => setParts((prev) => prev.filter((_, idx) => idx !== index));

  const handleSave = () => {
    setError('');
    if (!clientName.trim() || !equipment.trim()) {
      setError('Cliente e equipamento são obrigatórios.');
      return;
    }
    for (const part of parts) {
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
      <Text style={styles.title}>Novo serviço</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput style={styles.input} placeholder="Cliente" placeholderTextColor="#8E897E" value={clientName} onChangeText={setClientName} />
      <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#8E897E" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Equipamento" placeholderTextColor="#8E897E" value={equipment} onChangeText={setEquipment} />
      <TextInput style={[styles.input, styles.problemInput]} placeholder="Descrição do problema" placeholderTextColor="#8E897E" multiline value={problem} onChangeText={setProblem} />

      <Text style={styles.sectionTitle}>Peças utilizadas</Text>
      {parts.map((part, idx) => (
        <View key={idx} style={styles.partRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Descrição"
            placeholderTextColor="#8E897E"
            value={part.description}
            onChangeText={(text) => updatePart(idx, 'description', text)}
          />
          <TextInput
            style={[styles.input, styles.priceInput, { marginBottom: 0 }]}
            placeholder="R$"
            placeholderTextColor="#8E897E"
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
      <TouchableOpacity onPress={addPartRow}>
        <Text style={styles.addPartText}>+ Adicionar peça</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Valor da mão de obra"
        placeholderTextColor="#8E897E"
        keyboardType="decimal-pad"
        value={labourCost}
        onChangeText={setLabourCost}
      />

      <PrimaryButton title="Salvar" onPress={handleSave} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.snow, padding: 16 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', marginBottom: 12 },
  error: { color: palette.danger, marginBottom: 10 },
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    marginBottom: 12
  },
  problemInput: { minHeight: 110, textAlignVertical: 'top' },
  partRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  priceInput: { width: 96 },
  addPartText: { color: palette.gold, fontWeight: '600', marginBottom: 12 },
  removePartButton: { width: 28, alignItems: 'center' },
  removePartText: { color: palette.danger, fontSize: 24, lineHeight: 24 }
});

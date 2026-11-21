import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { palette, radii } from '../theme/palette';
import { parseMoney } from '../utils/format';

const EMPTY_PART = { description: '', price: '' };

function toFormState(service) {
  return {
    clientName: service?.clientName || '',
    phone: service?.phone || '',
    equipment: service?.equipment || '',
    problem: service?.problem || '',
    labourCost: service ? String(service.labourCost ?? '').replace('.', ',') : '',
    parts: service?.parts?.length
      ? service.parts.map((p) => ({ description: p.description, price: String(p.price).replace('.', ',') }))
      : [{ ...EMPTY_PART }]
  };
}

/**
 * Formulário compartilhado entre "Novo serviço" e "Editar serviço".
 * Valida os campos e entrega ao onSubmit os dados já convertidos em número.
 */
export default function ServiceForm({ title, submitLabel, initialValues, onSubmit }) {
  const [form, setForm] = useState(() => toFormState(initialValues));
  const [error, setError] = useState('');

  const setField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updatePart = (index, field, value) =>
    setForm((prev) => ({
      ...prev,
      parts: prev.parts.map((part, idx) => (idx === index ? { ...part, [field]: value } : part))
    }));

  const addPartRow = () => setForm((prev) => ({ ...prev, parts: [...prev.parts, { ...EMPTY_PART }] }));
  const removePart = (index) =>
    setForm((prev) => ({ ...prev, parts: prev.parts.filter((_, idx) => idx !== index) }));

  const handleSave = () => {
    setError('');
    if (!form.clientName.trim() || !form.equipment.trim()) {
      setError('Cliente e equipamento são obrigatórios.');
      return;
    }

    // Linhas de peça totalmente em branco são ignoradas
    const filledParts = form.parts.filter((p) => p.description.trim() || p.price.trim());
    const parts = [];
    for (const part of filledParts) {
      if (!part.description.trim()) {
        setError('Todas as peças precisam de descrição.');
        return;
      }
      const price = part.price.trim() ? parseMoney(part.price) : 0;
      if (price === null) {
        setError('Preço das peças deve ser um valor válido, como 25,90.');
        return;
      }
      parts.push({ description: part.description.trim(), price });
    }

    const labourCost = form.labourCost.trim() ? parseMoney(form.labourCost) : 0;
    if (labourCost === null) {
      setError('Valor da mão de obra deve ser um valor válido, como 80,00.');
      return;
    }

    onSubmit({
      clientName: form.clientName,
      phone: form.phone,
      equipment: form.equipment,
      problem: form.problem,
      parts,
      labourCost
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}

        <TextInput style={styles.input} placeholder="Cliente" placeholderTextColor="#8E897E" value={form.clientName} onChangeText={setField('clientName')} accessibilityLabel="Cliente" />
        <TextInput style={styles.input} placeholder="Telefone (com DDD)" placeholderTextColor="#8E897E" keyboardType="phone-pad" value={form.phone} onChangeText={setField('phone')} accessibilityLabel="Telefone" />
        <TextInput style={styles.input} placeholder="Equipamento" placeholderTextColor="#8E897E" value={form.equipment} onChangeText={setField('equipment')} accessibilityLabel="Equipamento" />
        <TextInput style={[styles.input, styles.problemInput]} placeholder="Descrição do problema" placeholderTextColor="#8E897E" multiline value={form.problem} onChangeText={setField('problem')} accessibilityLabel="Descrição do problema" />

        <Text style={styles.sectionTitle}>Peças utilizadas</Text>
        {form.parts.map((part, idx) => (
          <View key={idx} style={styles.partRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Descrição"
              placeholderTextColor="#8E897E"
              value={part.description}
              onChangeText={(text) => updatePart(idx, 'description', text)}
              accessibilityLabel={`Descrição da peça ${idx + 1}`}
            />
            <TextInput
              style={[styles.input, styles.priceInput, { marginBottom: 0 }]}
              placeholder="R$"
              placeholderTextColor="#8E897E"
              keyboardType="decimal-pad"
              value={part.price}
              onChangeText={(text) => updatePart(idx, 'price', text)}
              accessibilityLabel={`Preço da peça ${idx + 1}`}
            />
            {form.parts.length > 1 && (
              <TouchableOpacity onPress={() => removePart(idx)} style={styles.removePartButton} accessibilityLabel={`Remover peça ${idx + 1}`}>
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
          value={form.labourCost}
          onChangeText={setField('labourCost')}
          accessibilityLabel="Valor da mão de obra"
        />

        <PrimaryButton title={submitLabel} onPress={handleSave} style={{ marginTop: 8 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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

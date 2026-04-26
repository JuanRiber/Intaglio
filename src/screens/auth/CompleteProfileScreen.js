import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useProfile } from '../../context/ProfileContext';

/**
 * CompleteProfileScreen coleta informações profissionais adicionais após o
 * login. O usuário deve fornecer dados essenciais para que o app possa
 * personalizar a experiência. Após salvar, a tela é fechada via
 * detecção automática do ProfileContext.
 */
export default function CompleteProfileScreen() {
  const { saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    if (!name.trim() || !businessName.trim() || !specialty.trim() || !whatsapp.trim() || !city.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    await saveProfile({ name, businessName, specialty, whatsapp, city, paymentMethod });
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Completar perfil</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#777777"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Nome do negócio"
            placeholderTextColor="#777777"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Especialidade (ex. manutenção)"
            placeholderTextColor="#777777"
            value={specialty}
            onChangeText={setSpecialty}
          />
          <TextInput
            style={styles.input}
            placeholder="WhatsApp"
            placeholderTextColor="#777777"
            keyboardType="phone-pad"
            value={whatsapp}
            onChangeText={setWhatsapp}
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            placeholderTextColor="#777777"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Forma de cobrança padrão (opcional)"
            placeholderTextColor="#777777"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
          <PrimaryButton title={loading ? 'Salvando...' : 'Salvar'} onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 24
  },
  innerContainer: {
    backgroundColor: '#1f1f1f',
    padding: 24,
    borderRadius: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    marginBottom: 12
  },
  error: {
    color: '#e74c3c',
    marginBottom: 8
  }
});
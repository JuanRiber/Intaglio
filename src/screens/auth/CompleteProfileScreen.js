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
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import { useProfile } from '../../context/ProfileContext';
import { palette, radii } from '../../theme/palette';

export default function CompleteProfileScreen() {
  const navigation = useNavigation();
  const { saveProfile, profile } = useProfile();
  const [name, setName] = useState(profile?.name || '');
  const [businessName, setBusinessName] = useState(profile?.businessName || '');
  const [specialty, setSpecialty] = useState(profile?.specialty || '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '');
  const [city, setCity] = useState(profile?.city || '');
  const [paymentMethod, setPaymentMethod] = useState(profile?.paymentMethod || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    if (!name.trim() || !businessName.trim() || !specialty.trim() || !whatsapp.trim() || !city.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await saveProfile({ name, businessName, specialty, whatsapp, city, paymentMethod });
      // Ao editar um perfil já completo, volta para a tela anterior
      if (navigation.canGoBack()) navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.hero}>
          <Text style={styles.brand}>Intaglio</Text>
          <Text style={styles.heroTitle}>Completar perfil profissional</Text>
          <Text style={styles.heroText}>Finalize seu perfil para deixar o app com a sua cara.</Text>
        </View>

        <View style={styles.card}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput style={styles.input} placeholder="Nome do profissional" placeholderTextColor="#8E897E" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Nome do negócio" placeholderTextColor="#8E897E" value={businessName} onChangeText={setBusinessName} />
          <TextInput style={styles.input} placeholder="Especialidade" placeholderTextColor="#8E897E" value={specialty} onChangeText={setSpecialty} />
          <TextInput style={styles.input} placeholder="WhatsApp" placeholderTextColor="#8E897E" keyboardType="phone-pad" value={whatsapp} onChangeText={setWhatsapp} />
          <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor="#8E897E" value={city} onChangeText={setCity} />
          <TextInput style={styles.input} placeholder="Forma de cobrança padrão" placeholderTextColor="#8E897E" value={paymentMethod} onChangeText={setPaymentMethod} />
          <PrimaryButton title={loading ? 'Salvando...' : 'Concluir'} onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.snow,
    paddingHorizontal: 24
  },
  hero: {
    marginBottom: 20
  },
  brand: {
    color: palette.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  heroTitle: {
    color: palette.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    marginBottom: 8
  },
  heroText: {
    color: palette.textSoft,
    fontSize: 15,
    lineHeight: 22
  },
  card: {
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radii.lg,
    padding: 18
  },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FCFBF8',
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    marginBottom: 12
  },
  error: {
    color: palette.danger,
    marginBottom: 10
  }
});

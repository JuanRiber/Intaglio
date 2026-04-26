import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

/**
 * RegisterScreen permite que um novo usuário crie sua conta localmente.
 * Após o cadastro, o usuário é autenticado automaticamente. Os campos
 * essenciais são validados de forma simples.
 */
export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!nome.trim() || !telefone.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const result = await register({ nome, telefone, email, senha });
    setLoading(false);
    if (!result.success) {
      setError(result.message || 'Falha ao cadastrar.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Criar conta</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#777777"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#777777"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#777777"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#777777"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
          <PrimaryButton title={loading ? 'Criando...' : 'Cadastrar'} onPress={handleRegister} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
            <Text style={styles.link}>Voltar ao login</Text>
          </TouchableOpacity>
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
  },
  link: {
    color: '#006aff',
    textAlign: 'center'
  }
});
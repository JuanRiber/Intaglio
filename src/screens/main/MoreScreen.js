import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

/**
 * MoreScreen reúne ações secundárias como visualizar e editar o perfil
 * profissional, acessar configurações e sair da aplicação. Exibe dados
 * básicos do usuário e uma mensagem de agradecimento.
 */
export default function MoreScreen() {
  const navigation = useNavigation();
  const { profile, isProfileComplete } = useProfile();
  const { logout } = useAuth();

  const handleEditProfile = () => {
    // Navega para a tela de completar perfil novamente
    navigation.navigate('CompleteProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        {isProfileComplete && profile ? (
          <View>
            <Text style={styles.itemLabel}>Nome:</Text>
            <Text style={styles.itemValue}>{profile.name}</Text>
            <Text style={styles.itemLabel}>Negócio:</Text>
            <Text style={styles.itemValue}>{profile.businessName}</Text>
            <Text style={styles.itemLabel}>Especialidade:</Text>
            <Text style={styles.itemValue}>{profile.specialty}</Text>
            <Text style={styles.itemLabel}>WhatsApp:</Text>
            <Text style={styles.itemValue}>{profile.whatsapp}</Text>
            <Text style={styles.itemLabel}>Cidade:</Text>
            <Text style={styles.itemValue}>{profile.city}</Text>
            {profile.paymentMethod ? (
              <>
                <Text style={styles.itemLabel}>Forma de cobrança:</Text>
                <Text style={styles.itemValue}>{profile.paymentMethod}</Text>
              </>
            ) : null}
          </View>
        ) : (
          <Text style={{ color: '#777777' }}>Perfil incompleto.</Text>
        )}
        <PrimaryButton
          title={isProfileComplete ? 'Editar perfil' : 'Completar perfil'}
          onPress={handleEditProfile}
          style={{ marginTop: 12 }}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <Text style={styles.itemLabel}>Versão do app</Text>
        <Text style={styles.itemValue}>0.1.5</Text>
      </View>
      <View style={styles.section}>
        <PrimaryButton
          title="Sair"
          onPress={logout}
          style={{ backgroundColor: '#e74c3c' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8
  },
  itemLabel: {
    fontSize: 14,
    color: '#888888'
  },
  itemValue: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4
  }
});
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { formatPhone } from '../../utils/formatters';

export default function MoreScreen({ navigation }) {
  const { logout } = useAuth();
  const { profile, clearGaiaProfile } = useProfile();

  async function handleResetProfile() {
    Alert.alert('Limpar perfil', 'Isso remove apenas o perfil profissional salvo localmente.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await clearGaiaProfile();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mais</Text>
      <Text style={styles.subtitle}>Perfil, atalhos e ações de manutenção do fluxo atual.</Text>

      <SectionCard style={styles.profileCard}>
        <Text style={styles.sectionTitle}>{profile?.negocioNome || 'Seu negócio'}</Text>
        <Text style={styles.profileLine}>{profile?.profissionalNome || 'Profissional não definido'}</Text>
        <Text style={styles.profileLine}>{profile?.especialidade || 'Especialidade não definida'}</Text>
        <Text style={styles.profileLine}>{profile?.whatsapp ? formatPhone(profile.whatsapp) : 'WhatsApp não informado'}</Text>
        <Text style={styles.profileLine}>{profile?.cidade || 'Cidade não informada'}</Text>
      </SectionCard>

      <TouchableOpacity style={styles.menuRow} onPress={() => navigation.getParent()?.navigate('Completar perfil')}>
        <Text style={styles.menuTitle}>Editar perfil profissional</Text>
        <Text style={styles.menuText}>Atualize especialidade, cobrança padrão e dados do negócio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuRow} onPress={handleResetProfile}>
        <Text style={styles.menuTitle}>Limpar perfil salvo</Text>
        <Text style={styles.menuText}>Remove os dados profissionais locais para reconfigurar depois</Text>
      </TouchableOpacity>

      <PrimaryButton label="Sair da conta" variant="ghost" onPress={logout} style={styles.logoutButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 20, marginBottom: 14 },
  profileCard: { marginBottom: 14 },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  profileLine: { color: colors.textMuted, marginBottom: 6 },
  menuRow: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12 },
  menuTitle: { color: colors.white, fontWeight: '700', marginBottom: 6 },
  menuText: { color: colors.textMuted, lineHeight: 20 },
  logoutButton: { marginTop: 8 },
});

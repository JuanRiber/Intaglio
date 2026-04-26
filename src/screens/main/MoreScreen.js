import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { palette, radii } from '../../theme/palette';

export default function MoreScreen() {
  const navigation = useNavigation();
  const { profile, isProfileComplete } = useProfile();
  const { logout, currentUser } = useAuth();

  return (
    <View style={styles.container}>
      <SectionCard style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(currentUser?.nome || profile?.name || 'N').slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.name || currentUser?.nome || 'Seu perfil'}</Text>
            <Text style={styles.profileEmail}>{currentUser?.email || 'conta@nexo.app'}</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('CompleteProfile')}>
          <Text style={styles.rowText}>{isProfileComplete ? 'Dados da conta' : 'Completar perfil'}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Método de recebimento</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Mensagem automática</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Notificações</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.rowText}>Suporte</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </SectionCard>

      <PrimaryButton
        title="Sair da conta"
        onPress={logout}
        variant="secondary"
        style={styles.logoutButton}
        textStyle={{ color: palette.danger }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.snow, padding: 16 },
  profileCard: { padding: 18 },
  avatarWrap: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  avatarText: { color: palette.paper, fontSize: 22, fontWeight: '700' },
  profileName: { color: palette.text, fontSize: 18, fontWeight: '700' },
  profileEmail: { color: palette.textSoft, marginTop: 4 },
  row: {
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowText: { color: palette.text, fontSize: 15, fontWeight: '600' },
  chevron: { color: palette.textSoft, fontSize: 20 },
  logoutButton: {
    marginTop: 12,
    borderColor: '#E8CAC2'
  }
});

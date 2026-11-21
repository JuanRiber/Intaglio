import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/ServicesContext';
import { notify } from '../../utils/dialog';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { palette, radii } from '../../theme/palette';

const comingSoon = () => notify('Em breve', 'Esta função estará disponível numa próxima versão.');

export default function MoreScreen() {
  const navigation = useNavigation();
  const { profile, isProfileComplete, clearProfile } = useProfile();
  const { clearServices } = useServices();
  const { logout, currentUser, verifyCurrentPassword, deleteAccount } = useAuth();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const closeDelete = () => {
    if (deleting) return;
    setDeleteVisible(false);
    setDeletePassword('');
    setDeleteError('');
  };

  // Exige a senha, apaga serviços e perfil, e por último a própria conta
  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (!deletePassword) {
      setDeleteError('Digite sua senha para confirmar.');
      return;
    }
    setDeleting(true);
    try {
      const valid = await verifyCurrentPassword(deletePassword);
      if (!valid) {
        setDeleteError('Senha incorreta.');
        setDeleting(false);
        return;
      }
      await clearServices();
      await clearProfile();
      await deleteAccount();
    } catch (err) {
      setDeleteError('Não foi possível excluir a conta agora. Tente novamente.');
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SectionCard style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(currentUser?.nome || profile?.name || 'N').slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.name || currentUser?.nome || 'Seu perfil'}</Text>
            <Text style={styles.profileEmail}>{currentUser?.email || ''}</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('CompleteProfile')}>
          <Text style={styles.rowText}>{isProfileComplete ? 'Dados da conta' : 'Completar perfil'}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={comingSoon}>
          <Text style={styles.rowText}>Método de recebimento</Text>
          <Text style={styles.soon}>Em breve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={comingSoon}>
          <Text style={styles.rowText}>Mensagem automática</Text>
          <Text style={styles.soon}>Em breve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={comingSoon}>
          <Text style={styles.rowText}>Notificações</Text>
          <Text style={styles.soon}>Em breve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={comingSoon}>
          <Text style={styles.rowText}>Suporte</Text>
          <Text style={styles.soon}>Em breve</Text>
        </TouchableOpacity>
      </SectionCard>

      <PrimaryButton
        title="Sair da conta"
        onPress={logout}
        variant="secondary"
        style={styles.logoutButton}
        textStyle={{ color: palette.danger }}
      />

      <TouchableOpacity onPress={() => setDeleteVisible(true)} style={styles.deleteLink} accessibilityRole="button">
        <Text style={styles.deleteLinkText}>Excluir minha conta</Text>
      </TouchableOpacity>

      <Modal visible={deleteVisible} transparent animationType="fade" onRequestClose={closeDelete}>
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Excluir conta</Text>
            <Text style={styles.modalText}>
              Isso apaga para sempre, neste aparelho, sua conta, seu perfil e todos os serviços, clientes e
              registros financeiros. Não dá para desfazer.
            </Text>
            {deleteError ? <Text style={styles.modalError} accessibilityRole="alert">{deleteError}</Text> : null}
            <TextInput
              style={styles.modalInput}
              placeholder="Digite sua senha para confirmar"
              placeholderTextColor="#8E897E"
              secureTextEntry
              autoComplete="current-password"
              value={deletePassword}
              onChangeText={setDeletePassword}
              accessibilityLabel="Senha para confirmar a exclusão"
            />
            <PrimaryButton
              title={deleting ? 'Excluindo...' : 'Excluir definitivamente'}
              onPress={handleDeleteAccount}
              disabled={deleting}
              style={styles.modalDanger}
              textStyle={{ color: palette.paper }}
            />
            <PrimaryButton title="Cancelar" onPress={closeDelete} variant="secondary" disabled={deleting} style={{ marginTop: 10 }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  soon: { color: palette.textSoft, fontSize: 12 },
  logoutButton: {
    marginTop: 12,
    borderColor: '#E8CAC2'
  },
  deleteLink: { alignSelf: 'center', paddingVertical: 16 },
  deleteLinkText: { color: palette.textSoft, fontSize: 13, textDecorationLine: 'underline' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,15,16,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: palette.paper, borderRadius: radii.lg, padding: 20, width: '100%', maxWidth: 420, alignSelf: 'center' },
  modalTitle: { color: palette.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  modalText: { color: palette.textSoft, fontSize: 14, lineHeight: 20, marginBottom: 14 },
  modalError: { color: palette.danger, marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.snow,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    marginBottom: 12
  },
  modalDanger: { backgroundColor: palette.danger, borderColor: palette.danger }
});

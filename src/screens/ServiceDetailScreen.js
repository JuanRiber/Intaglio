import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../constants/theme';
import { useServices, ServiceStatus } from '../context/ServicesContext';
import { formatCurrency, formatPhone, getServiceTotal, statusLabel } from '../utils/formatters';

export default function ServiceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params || {};
  const { services, updateStatus, deleteService } = useServices();

  const targetService = services.find((service) => service.id === serviceId);

  if (!targetService) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundText}>Serviço não encontrado.</Text>
      </View>
    );
  }

  const totalParts = Array.isArray(targetService.pecas)
    ? targetService.pecas.reduce((sum, piece) => sum + Number(piece.valor || 0), 0)
    : 0;

  const totalService = getServiceTotal(targetService);

  const statusOptions = [
    ServiceStatus.AGUARDANDO,
    ServiceStatus.EM_SERVICO,
    ServiceStatus.PRONTO,
    ServiceStatus.ENTREGUE,
    ServiceStatus.PAGO,
  ];

  function handleWhatsappShare() {
    if (!targetService.telefone) {
      Alert.alert('Telefone não informado');
      return;
    }

    const message = encodeURIComponent([
      `Olá ${targetService.cliente}, segue o resumo do seu serviço no Nexo.`,
      `Equipamento: ${targetService.equipamento}`,
      `Status: ${statusLabel(targetService.status)}`,
      `Peças: ${formatCurrency(totalParts)}`,
      `Mão de obra: ${formatCurrency(targetService.maoDeObra)}`,
      `Total: ${formatCurrency(totalService)}`,
    ].join('\n'));

    Linking.openURL(`https://wa.me/${targetService.telefone.replace(/\D/g, '')}?text=${message}`).catch(() => {
      Alert.alert('Não foi possível abrir o WhatsApp.');
    });
  }

  function handleDeleteService() {
    Alert.alert('Excluir serviço', 'Essa ação remove o serviço do app. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteService(targetService.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{targetService.cliente}</Text>
        <Text style={styles.heroSubtitle}>{targetService.equipamento}</Text>
        <Text style={styles.heroStatus}>{statusLabel(targetService.status)}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Dados do cliente</Text>
        <Text style={styles.infoLabel}>Telefone</Text>
        <Text style={styles.infoValue}>{targetService.telefone ? formatPhone(targetService.telefone) : 'Não informado'}</Text>
        <Text style={styles.infoLabel}>Problema</Text>
        <Text style={styles.infoValue}>{targetService.problema || 'Sem descrição registrada.'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Orçamento</Text>
        {(targetService.pecas || []).length === 0 ? (
          <Text style={styles.infoValue}>Nenhuma peça registrada.</Text>
        ) : (
          targetService.pecas.map((piece, index) => (
            <View key={`${piece.descricao}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemText}>{piece.descricao}</Text>
              <Text style={styles.itemText}>{formatCurrency(piece.valor)}</Text>
            </View>
          ))
        )}
        <View style={styles.itemRow}><Text style={styles.itemStrong}>Subtotal peças</Text><Text style={styles.itemStrong}>{formatCurrency(totalParts)}</Text></View>
        <View style={styles.itemRow}><Text style={styles.itemStrong}>Mão de obra</Text><Text style={styles.itemStrong}>{formatCurrency(targetService.maoDeObra)}</Text></View>
        <View style={styles.itemRow}><Text style={styles.totalLabel}>Total final</Text><Text style={styles.totalValue}>{formatCurrency(totalService)}</Text></View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Status do serviço</Text>
        <View style={styles.statusWrap}>
          {statusOptions.map((statusValue) => {
            const isActive = targetService.status === statusValue;
            return (
              <TouchableOpacity key={statusValue} style={[styles.statusChip, isActive && styles.statusChipActive]} onPress={() => updateStatus(targetService.id, statusValue)}>
                <Text style={[styles.statusChipText, isActive && styles.statusChipTextActive]}>{statusLabel(statusValue)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.primaryAction} onPress={() => navigation.navigate('Editar serviço', { serviceId: targetService.id })}>
        <Text style={styles.primaryActionText}>Editar serviço</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.whatsappAction} onPress={handleWhatsappShare}>
        <Text style={styles.whatsappActionText}>Enviar orçamento via WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteAction} onPress={handleDeleteService}>
        <Text style={styles.deleteActionText}>Excluir serviço</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: colors.background },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  notFoundText: { color: colors.white, fontSize: 16 },
  heroCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 18, marginBottom: 14 },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  heroSubtitle: { color: colors.textMuted, marginBottom: 8 },
  heroStatus: { color: colors.accent, fontWeight: '700' },
  infoCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, marginBottom: 14 },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  infoLabel: { color: colors.textMuted, marginBottom: 4 },
  infoValue: { color: colors.white, marginBottom: 12, lineHeight: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  itemText: { color: colors.textMuted, flex: 1 },
  itemStrong: { color: colors.white, fontWeight: '700' },
  totalLabel: { color: colors.white, fontWeight: '800', fontSize: 16 },
  totalValue: { color: colors.success, fontWeight: '800', fontSize: 16 },
  statusWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft },
  statusChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusChipText: { color: colors.textMuted, fontWeight: '700' },
  statusChipTextActive: { color: colors.white },
  primaryAction: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  primaryActionText: { color: colors.white, fontWeight: '800' },
  whatsappAction: { backgroundColor: colors.success, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  whatsappActionText: { color: colors.white, fontWeight: '800' },
  deleteAction: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.danger, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 20 },
  deleteActionText: { color: colors.danger, fontWeight: '800' },
});

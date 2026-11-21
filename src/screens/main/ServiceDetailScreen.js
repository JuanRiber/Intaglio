import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useServices, SERVICE_STATUSES, SERVICE_STATUS_ORDER, getStatusInfo } from '../../context/ServicesContext';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { palette, radii } from '../../theme/palette';
import { confirmAction, notify } from '../../utils/dialog';
import { formatCurrency, getServiceTotals, toWhatsAppNumber } from '../../utils/format';

export default function ServiceDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceId } = route.params || {};
  const { services, updateStatus, deleteService } = useServices();
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={{ color: palette.text }}>Serviço não encontrado.</Text>
      </View>
    );
  }

  const currentIndex = SERVICE_STATUS_ORDER.indexOf(service.status);
  const nextStatus = currentIndex >= 0 && currentIndex < SERVICE_STATUS_ORDER.length - 1
    ? SERVICE_STATUS_ORDER[currentIndex + 1]
    : null;

  const { partsTotal, labourCost, total } = getServiceTotals(service);

  const handleDelete = async () => {
    const confirmed = await confirmAction({
      title: 'Excluir serviço',
      message: 'Tem certeza que deseja excluir este serviço?',
      confirmText: 'Excluir',
      destructive: true
    });
    if (!confirmed) return;
    deleteService(service.id);
    navigation.goBack();
  };

  const handleShareWhatsApp = async () => {
    const number = toWhatsAppNumber(service.phone);
    if (!number) {
      notify('Telefone inválido', 'Edite o serviço e informe um telefone com DDD para enviar o orçamento.');
      return;
    }
    const message =
      `Olá ${service.clientName}!\n` +
      `Segue o orçamento para o serviço no equipamento ${service.equipment}.\n` +
      `Peças: ${formatCurrency(partsTotal)}\n` +
      `Mão de obra: ${formatCurrency(labourCost)}\n` +
      `Total: ${formatCurrency(total)}\n` +
      `Status atual: ${getStatusInfo(service.status).label}.`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    try {
      await Linking.openURL(url);
    } catch (err) {
      notify('Não foi possível abrir o WhatsApp', 'Verifique se o aplicativo está instalado.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <SectionCard tone="dark">
        <Text style={styles.heroName}>{service.clientName}</Text>
        <Text style={styles.heroSub}>{service.equipment}</Text>
      </SectionCard>

      <View style={styles.statusRow}>
        {Object.keys(SERVICE_STATUSES).map((key) => (
          <View key={key} style={[
            styles.statusChip,
            service.status === key && styles.statusChipActive
          ]}>
            <Text style={[
              styles.statusChipText,
              service.status === key && styles.statusChipTextActive
            ]}>
              {SERVICE_STATUSES[key].label}
            </Text>
          </View>
        ))}
      </View>

      <SectionCard>
        <View style={styles.detailRow}><Text style={styles.label}>Cliente</Text><Text style={styles.value}>{service.clientName}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Telefone</Text><Text style={styles.value}>{service.phone || '—'}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Equipamento</Text><Text style={styles.value}>{service.equipment}</Text></View>
        <View style={styles.problemBlock}>
          <Text style={styles.label}>Descrição do problema</Text>
          <Text style={styles.valueBlock}>{service.problem || '—'}</Text>
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.blockTitle}>Orçamento</Text>
        {service.parts.map((part, idx) => (
          <View key={idx} style={styles.detailRow}>
            <Text style={styles.value}>{part.description}</Text>
            <Text style={styles.value}>{formatCurrency(part.price)}</Text>
          </View>
        ))}
        <View style={styles.detailRow}><Text style={styles.label}>Subtotal</Text><Text style={styles.value}>{formatCurrency(partsTotal)}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Mão de obra</Text><Text style={styles.value}>{formatCurrency(labourCost)}</Text></View>
        <View style={[styles.detailRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatCurrency(total)}</Text></View>
      </SectionCard>

      {nextStatus ? (
        <PrimaryButton
          title={`Marcar como ${SERVICE_STATUSES[nextStatus].label}`}
          onPress={() => updateStatus(service.id, nextStatus)}
        />
      ) : null}
      <PrimaryButton title="Editar" onPress={() => navigation.navigate('EditService', { serviceId: service.id })} variant="secondary" style={{ marginTop: 12 }} />
      <PrimaryButton title="Enviar orçamento" onPress={handleShareWhatsApp} style={{ marginTop: 12 }} />
      <PrimaryButton title="Excluir" onPress={handleDelete} style={{ marginTop: 12, backgroundColor: palette.danger, borderColor: palette.danger }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.snow },
  heroName: { color: palette.paper, fontSize: 28, fontWeight: '700' },
  heroSub: { color: palette.goldSoft, marginTop: 6, fontSize: 14 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginBottom: 12 },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    marginRight: 8,
    marginBottom: 8
  },
  statusChipActive: { backgroundColor: palette.gold, borderColor: '#B88624' },
  statusChipText: { color: palette.textSoft, fontSize: 12, fontWeight: '600' },
  statusChipTextActive: { color: palette.ink },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { color: palette.textSoft, fontSize: 13 },
  value: { color: palette.text, fontSize: 14, fontWeight: '600' },
  problemBlock: { marginTop: 8 },
  valueBlock: { color: palette.text, fontSize: 14, lineHeight: 22, marginTop: 6 },
  blockTitle: { color: palette.text, fontSize: 18, fontWeight: '700', marginBottom: 10 },
  totalRow: { paddingTop: 8, borderTopWidth: 1, borderTopColor: palette.line, marginTop: 8 },
  totalLabel: { color: palette.text, fontSize: 16, fontWeight: '700' },
  totalValue: { color: palette.text, fontSize: 22, fontWeight: '700' }
});

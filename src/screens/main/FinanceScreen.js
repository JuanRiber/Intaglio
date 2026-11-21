import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import SectionCard from '../../components/SectionCard';
import { palette, radii, shadowCard } from '../../theme/palette';
import { formatCurrency, formatDate, getServiceTotals } from '../../utils/format';

export default function FinanceScreen() {
  const { services, summary } = useServices();

  const paidServices = useMemo(
    () =>
      services
        .filter((svc) => svc.status === 'PAGO' && svc.paidAt)
        .map((svc) => ({
          id: svc.id,
          client: svc.clientName,
          equipment: svc.equipment,
          total: getServiceTotals(svc).total,
          paidAt: svc.paidAt
        }))
        .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)),
    [services]
  );

  return (
    <View style={styles.container}>
      <SectionCard tone="dark">
        <Text style={styles.heroLabel}>Faturamento do mês</Text>
        <Text style={styles.heroValue}>{formatCurrency(summary.monthlyRevenue)}</Text>
        <Text style={styles.heroSub}>Recebimentos fechados no período atual</Text>
      </SectionCard>

      <View style={styles.duoGrid}>
        <SectionCard style={styles.smallCard}>
          <Text style={styles.smallLabel}>Serviços pagos</Text>
          <Text style={styles.smallValue}>{summary.paidThisMonth}</Text>
        </SectionCard>
        <SectionCard style={styles.smallCard}>
          <Text style={styles.smallLabel}>Total geral</Text>
          <Text style={styles.smallValue}>{formatCurrency(summary.totalRevenue)}</Text>
        </SectionCard>
      </View>

      <Text style={styles.listTitle}>Recebimentos recentes</Text>
      <FlatList
        data={paidServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{item.client?.slice(0, 1)?.toUpperCase() || 'N'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentClient}>{item.client}</Text>
              <Text style={styles.paymentEquipment}>{item.equipment}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.paymentTotal}>{formatCurrency(item.total)}</Text>
              <Text style={styles.paymentDate}>{formatDate(item.paidAt)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço pago ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.snow, padding: 16 },
  heroLabel: { color: '#D7D0C2', fontSize: 14, marginBottom: 6 },
  heroValue: { color: palette.paper, fontSize: 30, fontWeight: '700' },
  heroSub: { color: palette.goldSoft, fontSize: 12, marginTop: 6 },
  duoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  smallCard: { width: '48%' },
  smallLabel: { color: palette.textSoft, fontSize: 13 },
  smallValue: { color: palette.text, fontSize: 24, fontWeight: '700', marginTop: 6 },
  listTitle: { color: palette.text, fontSize: 18, fontWeight: '700', marginBottom: 10 },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 10,
    ...shadowCard
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarText: { color: palette.paper, fontWeight: '700' },
  paymentClient: { fontSize: 15, color: palette.text, fontWeight: '700' },
  paymentEquipment: { fontSize: 13, color: palette.textSoft, marginTop: 3 },
  paymentTotal: { fontSize: 15, color: palette.text, fontWeight: '700' },
  paymentDate: { fontSize: 12, color: palette.textSoft, marginTop: 3 },
  empty: { color: palette.textSoft, textAlign: 'center', marginTop: 24 }
});

import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import SectionCard from '../../components/SectionCard';
import { useServices, ServiceStatus } from '../../context/ServicesContext';
import { formatCurrency, getServiceTotal } from '../../utils/formatters';

export default function FinanceScreen() {
  const { services, getMonthlyRevenue } = useServices();

  const financeOverviewAthena = useMemo(() => {
    const paidServices = services.filter((service) => service.status === ServiceStatus.PAGO);
    const pendingServices = services.filter((service) => service.status !== ServiceStatus.PAGO);

    return {
      faturamentoMes: getMonthlyRevenue(),
      pagosNoMes: paidServices.length,
      valorEmAberto: pendingServices.reduce((sum, service) => sum + getServiceTotal(service), 0),
      pagamentosRecentes: [...paidServices]
        .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt))
        .slice(0, 5),
    };
  }, [getMonthlyRevenue, services]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Financeiro</Text>
      <Text style={styles.subtitle}>Uma visão simples do que entrou, do que ainda está aberto e do que acabou de fechar.</Text>

      <View style={styles.summaryGrid}>
        <SectionCard style={styles.summaryCard}><Text style={styles.summaryValue}>{formatCurrency(financeOverviewAthena.faturamentoMes)}</Text><Text style={styles.summaryLabel}>Faturamento do mês</Text></SectionCard>
        <SectionCard style={styles.summaryCard}><Text style={styles.summaryValue}>{financeOverviewAthena.pagosNoMes}</Text><Text style={styles.summaryLabel}>Serviços pagos</Text></SectionCard>
        <SectionCard style={styles.summaryCardWide}><Text style={styles.summaryValue}>{formatCurrency(financeOverviewAthena.valorEmAberto)}</Text><Text style={styles.summaryLabel}>Valor em aberto</Text></SectionCard>
      </View>

      <SectionCard>
        <Text style={styles.sectionTitle}>Pagamentos recentes</Text>
        {financeOverviewAthena.pagamentosRecentes.length === 0 ? (
          <Text style={styles.emptyText}>Ainda não há pagamentos registrados neste fluxo.</Text>
        ) : (
          financeOverviewAthena.pagamentosRecentes.map((service) => (
            <View key={service.id} style={styles.paymentRow}>
              <View>
                <Text style={styles.paymentClient}>{service.cliente}</Text>
                <Text style={styles.paymentMeta}>{service.equipamento}</Text>
              </View>
              <Text style={styles.paymentValue}>{formatCurrency(getServiceTotal(service))}</Text>
            </View>
          ))
        )}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 20, marginBottom: 14 },
  summaryGrid: { gap: 12, marginBottom: 14 },
  summaryCard: { },
  summaryCardWide: { },
  summaryValue: { color: colors.white, fontSize: 26, fontWeight: '800', marginBottom: 6 },
  summaryLabel: { color: colors.textMuted },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  emptyText: { color: colors.textMuted, lineHeight: 20 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  paymentClient: { color: colors.white, fontWeight: '700', marginBottom: 4 },
  paymentMeta: { color: colors.textMuted },
  paymentValue: { color: colors.success, fontWeight: '800' },
});

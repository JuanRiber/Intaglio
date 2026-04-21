import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import SectionCard from '../../components/SectionCard';
import { useServices, ServiceStatus } from '../../context/ServicesContext';
import { useProfile } from '../../context/ProfileContext';
import { formatCurrency, getServiceTotal, statusLabel } from '../../utils/formatters';

export default function DashboardScreen({ navigation }) {
  const { services, getMonthlyRevenue } = useServices();
  const { profile } = useProfile();

  const financeCardsAthena = useMemo(() => {
    const monthlyRevenueApollo = getMonthlyRevenue();
    const ativos = services.filter((item) => item.status !== ServiceStatus.PAGO).length;
    const aguardando = services.filter((item) => item.status === ServiceStatus.AGUARDANDO).length;
    const prontos = services.filter((item) => item.status === ServiceStatus.PRONTO).length;
    const pagos = services.filter((item) => item.status === ServiceStatus.PAGO).length;
    return { monthlyRevenueApollo, ativos, aguardando, prontos, pagos };
  }, [getMonthlyRevenue, services]);

  const recentServices = useMemo(
    () => [...services].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [services]
  );

  const apolloSeries = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((label, index) => ({
      label,
      value: services
        .filter((service) => service.status === ServiceStatus.PAGO && service.paidAt)
        .filter((service) => new Date(service.paidAt).getMonth() === index)
        .reduce((sum, service) => sum + getServiceTotal(service), 0),
    }));
  }, [services]);

  const maxSeriesValue = Math.max(...apolloSeries.map((item) => item.value), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroPanel}>
        <Text style={styles.eyebrow}>Início</Text>
        <Text style={styles.title}>Olá, {profile?.profissionalNome || 'profissional'}.</Text>
        <Text style={styles.subtitle}>Veja o pulso do trabalho, os pagamentos e o que pede ação agora.</Text>
      </View>

      <SectionCard style={styles.primaryFinanceCard}>
        <Text style={styles.cardLabel}>Faturamento do mês</Text>
        <Text style={styles.primaryValue}>{formatCurrency(financeCardsAthena.monthlyRevenueApollo)}</Text>
        <TouchableOpacity style={styles.primaryAction} onPress={() => navigation.getParent()?.navigate('Novo serviço')}>
          <Text style={styles.primaryActionText}>Novo serviço</Text>
        </TouchableOpacity>
      </SectionCard>

      <View style={styles.statsGrid}>
        <SectionCard style={styles.smallCard}><Text style={styles.smallValue}>{financeCardsAthena.ativos}</Text><Text style={styles.smallLabel}>Serviços ativos</Text></SectionCard>
        <SectionCard style={styles.smallCard}><Text style={styles.smallValue}>{financeCardsAthena.aguardando}</Text><Text style={styles.smallLabel}>Aguardando resposta</Text></SectionCard>
        <SectionCard style={styles.smallCard}><Text style={styles.smallValue}>{financeCardsAthena.prontos}</Text><Text style={styles.smallLabel}>Prontos para entrega</Text></SectionCard>
        <SectionCard style={styles.smallCard}><Text style={styles.smallValue}>{financeCardsAthena.pagos}</Text><Text style={styles.smallLabel}>Pagos no mês</Text></SectionCard>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Clientes')}>
          <Text style={styles.quickButtonTitle}>Clientes</Text>
          <Text style={styles.quickButtonText}>Acesso rápido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('Financeiro')}>
          <Text style={styles.quickButtonTitle}>Orçamentos pendentes</Text>
          <Text style={styles.quickButtonText}>{financeCardsAthena.aguardando} em espera</Text>
        </TouchableOpacity>
      </View>

      <SectionCard style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Evolução mensal</Text>
        <View style={styles.chartRow}>
          {apolloSeries.map((item) => {
            const height = Math.max(16, (item.value / maxSeriesValue) * 120);
            return (
              <View key={item.label} style={styles.barColumn}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </SectionCard>

      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Serviços recentes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Serviços')}>
          <Text style={styles.linkText}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {recentServices.length === 0 ? (
        <SectionCard>
          <Text style={styles.emptyTitle}>Sem serviços ainda</Text>
          <Text style={styles.emptyText}>Crie o primeiro atendimento para começar a montar o fluxo do Nexo.</Text>
        </SectionCard>
      ) : (
        recentServices.map((service) => (
          <TouchableOpacity key={service.id} style={styles.serviceCard} onPress={() => navigation.getParent()?.navigate('Detalhes do Serviço', { serviceId: service.id })}>
            <View>
              <Text style={styles.serviceTitle}>{service.cliente}</Text>
              <Text style={styles.serviceSubtitle}>{service.equipamento}</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.serviceStatus}>{statusLabel(service.status)}</Text>
              <Text style={styles.serviceValue}>{formatCurrency(getServiceTotal(service))}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  heroPanel: { marginBottom: 14 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 20 },
  primaryFinanceCard: { marginBottom: 14 },
  cardLabel: { color: colors.textMuted, marginBottom: 8 },
  primaryValue: { color: colors.white, fontSize: 30, fontWeight: '800', marginBottom: 14 },
  primaryAction: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  primaryActionText: { color: colors.white, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginBottom: 14 },
  smallCard: { width: '48%' },
  smallValue: { color: colors.white, fontSize: 24, fontWeight: '800', marginBottom: 6 },
  smallLabel: { color: colors.textMuted, lineHeight: 18 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  quickButton: { flex: 1, backgroundColor: colors.surfaceSoft, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  quickButtonTitle: { color: colors.white, fontWeight: '700', marginBottom: 4 },
  quickButtonText: { color: colors.textMuted, lineHeight: 18 },
  chartCard: { marginBottom: 14 },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 140 },
  barColumn: { alignItems: 'center', flex: 1 },
  bar: { width: 24, borderRadius: 10, backgroundColor: colors.primary },
  barLabel: { color: colors.textMuted, marginTop: 10, fontSize: 12 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  linkText: { color: colors.primary, fontWeight: '700' },
  emptyTitle: { color: colors.white, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: colors.textMuted, lineHeight: 20 },
  serviceCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceTitle: { color: colors.white, fontWeight: '700', marginBottom: 4 },
  serviceSubtitle: { color: colors.textMuted },
  serviceRight: { alignItems: 'flex-end' },
  serviceStatus: { color: colors.accent, fontWeight: '700', marginBottom: 4 },
  serviceValue: { color: colors.white, fontWeight: '700' },
});

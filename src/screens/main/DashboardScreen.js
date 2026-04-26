import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useServices, SERVICE_STATUSES } from '../../context/ServicesContext';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import { palette, shadowCard, radii } from '../../theme/palette';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { profile } = useProfile();
  const { services, summary } = useServices();

  const recentServices = React.useMemo(
    () => [...services].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [services]
  );

  const firstName = profile?.name?.split(' ')[0] || 'João';

  const renderRecent = ({ item }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => navigation.navigate('ServicesTab', { screen: 'ServiceDetail', params: { serviceId: item.id } })}
    >
      <View style={styles.avatarBox}>
        <Text style={styles.avatarText}>{item.clientName?.slice(0, 1)?.toUpperCase() || 'N'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.recentClient}>{item.clientName}</Text>
        <Text style={styles.recentSub}>{item.equipment}</Text>
      </View>
      <View style={styles.statusPill(item.status)}>
        <Text style={styles.statusPillText}>{SERVICE_STATUSES[item.status].label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={recentServices}
      keyExtractor={(item) => item.id}
      renderItem={renderRecent}
      ListHeaderComponent={
        <>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.hello}>Olá, {firstName}.</Text>
                <Text style={styles.helloSub}>Aqui está o resumo do seu negócio.</Text>
              </View>
            </View>
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Faturamento do mês</Text>
              <Text style={styles.revenueValue}>R$ {summary.monthlyRevenue.toFixed(2)}</Text>
              <Text style={styles.revenueHint}>controle claro do que entrou no período</Text>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <SectionCard style={styles.metricCard}>
              <Text style={styles.metricNumber}>{services.length}</Text>
              <Text style={styles.metricLabel}>Serviços ativos</Text>
            </SectionCard>
            <SectionCard style={styles.metricCard}>
              <Text style={styles.metricNumber}>{summary.counts.AGUARDANDO}</Text>
              <Text style={styles.metricLabel}>Aguardando resposta</Text>
            </SectionCard>
            <SectionCard style={styles.metricCard}>
              <Text style={styles.metricNumber}>{summary.counts.PRONTO}</Text>
              <Text style={styles.metricLabel}>Prontos para entrega</Text>
            </SectionCard>
            <SectionCard style={styles.metricCard}>
              <Text style={styles.metricNumber}>{summary.counts.PAGO}</Text>
              <Text style={styles.metricLabel}>Pagos no mês</Text>
            </SectionCard>
          </View>

          <PrimaryButton
            title="+ Novo serviço"
            onPress={() => navigation.navigate('ServicesTab', { screen: 'NewService' })}
            style={{ marginBottom: 16 }}
          />

          <View style={styles.quickGrid}>
            <SectionCard style={styles.quickCard}>
              <Text style={styles.quickTitle}>Clientes</Text>
              <Text style={styles.quickSub}>Ver todos</Text>
            </SectionCard>
            <SectionCard style={styles.quickCard}>
              <Text style={styles.quickTitle}>Orçamentos</Text>
              <Text style={styles.quickSub}>Pendentes</Text>
            </SectionCard>
          </View>

          <SectionCard>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Evolução do faturamento</Text>
              <Text style={styles.chartMonth}>Este mês</Text>
            </View>
            <View style={styles.chartArea}>
              <View style={styles.chartLine} />
            </View>
          </SectionCard>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Serviços recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServicesTab')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço cadastrado ainda.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.snow },
  content: { padding: 16, paddingBottom: 28 },
  hero: {
    backgroundColor: palette.ink,
    borderRadius: radii.lg,
    padding: 18,
    marginBottom: 16
  },
  heroTop: { marginBottom: 18 },
  hello: { color: palette.paper, fontSize: 28, fontWeight: '700' },
  helloSub: { color: '#D2CCBF', fontSize: 14, marginTop: 4 },
  revenueCard: {
    backgroundColor: '#151516',
    borderWidth: 1,
    borderColor: '#2B261C',
    borderRadius: radii.md,
    padding: 16
  },
  revenueLabel: { color: '#D7D0C2', fontSize: 14, marginBottom: 6 },
  revenueValue: { color: palette.paper, fontSize: 30, fontWeight: '700' },
  revenueHint: { color: palette.goldSoft, fontSize: 12, marginTop: 6 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: '48%', paddingVertical: 18 },
  metricNumber: { fontSize: 26, fontWeight: '700', color: palette.text, marginBottom: 4 },
  metricLabel: { fontSize: 13, color: palette.textSoft, lineHeight: 18 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickCard: { width: '48%' },
  quickTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  quickSub: { marginTop: 6, color: palette.textSoft },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartMonth: { color: palette.textSoft, fontSize: 12 },
  chartArea: {
    height: 120,
    marginTop: 14,
    borderRadius: radii.md,
    backgroundColor: '#FCFBF8',
    borderWidth: 1,
    borderColor: palette.line,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  chartLine: {
    marginHorizontal: 12,
    height: 2,
    backgroundColor: palette.gold,
    borderRadius: 999,
    transform: [{ rotate: '-6deg' }, { scaleX: 0.92 }]
  },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  seeAll: { color: palette.gold, fontWeight: '600' },
  recentItem: {
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
  recentClient: { color: palette.text, fontSize: 15, fontWeight: '700' },
  recentSub: { color: palette.textSoft, fontSize: 13, marginTop: 3 },
  statusPill: (status) => ({
    backgroundColor: SERVICE_STATUSES[status].color + '22',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  }),
  statusPillText: { color: palette.text, fontSize: 11, fontWeight: '700' },
  empty: { color: palette.textSoft, textAlign: 'center', paddingVertical: 24 }
});

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useServices, SERVICE_STATUSES } from '../../context/ServicesContext';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';

/**
 * DashboardScreen apresenta um painel geral com saudação, faturamento
 * mensal, contagem de serviços por status e a lista de serviços mais
 * recentes. Também oferece atalhos para criar um novo serviço ou acessar
 * outras áreas do aplicativo.
 */
export default function DashboardScreen() {
  const navigation = useNavigation();
  const { profile } = useProfile();
  const { services, summary } = useServices();

  const recentServices = React.useMemo(() => {
    return [...services]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [services]);

  const greetName = profile?.name?.split(' ')[0] || 'Bem-vindo';

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ServicesTab', {
        screen: 'ServiceDetail',
        params: { serviceId: item.id }
      })}
      style={styles.serviceItem}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.serviceClient}>{item.clientName}</Text>
        <Text style={styles.serviceEquipment}>{item.equipment}</Text>
      </View>
      <View style={styles.statusBadge(item.status)}>
        <Text style={styles.statusText}>{SERVICE_STATUSES[item.status].label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            <Text style={styles.greeting}>Olá, {greetName} 👋</Text>
            <SectionCard>
              <Text style={styles.cardTitle}>Faturamento do mês</Text>
              <Text style={styles.revenue}>R$ {summary.monthlyRevenue.toFixed(2)}</Text>
            </SectionCard>
            <SectionCard>
              <Text style={styles.cardTitle}>Serviços por status</Text>
              <View style={styles.statusRow}>
                {Object.keys(SERVICE_STATUSES).map((key) => (
                  <View key={key} style={styles.statusColumn}>
                    <Text style={[styles.statusCount, { color: SERVICE_STATUSES[key].color }]}> {summary.counts[key]} </Text>
                    <Text style={styles.statusLabel}>{SERVICE_STATUSES[key].label}</Text>
                  </View>
                ))}
              </View>
            </SectionCard>
            <SectionCard>
              <View style={styles.actionsRow}>
                <PrimaryButton
                  title="Novo serviço"
                  onPress={() => navigation.navigate('ServicesTab', { screen: 'NewService' })}
                  style={styles.actionButton}
                />
                <PrimaryButton
                  title="Clientes"
                  onPress={() => navigation.navigate('ClientsTab')}
                  style={styles.actionButton}
                />
                <PrimaryButton
                  title="Orçamentos"
                  onPress={() => navigation.navigate('ServicesTab')}
                  style={styles.actionButton}
                />
              </View>
            </SectionCard>
            <Text style={styles.sectionHeader}>Serviços recentes</Text>
          </View>
        }
        data={recentServices}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço cadastrado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  greeting: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 4
  },
  revenue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#27ae60'
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  statusColumn: {
    alignItems: 'center',
    flex: 1
  },
  statusCount: {
    fontSize: 20,
    fontWeight: '600'
  },
  statusLabel: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center'
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4
  },
  sectionHeader: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginVertical: 12
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222'
  },
  serviceClient: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  serviceEquipment: {
    color: '#888888',
    fontSize: 14
  },
  statusBadge: (status) => ({
    backgroundColor: SERVICE_STATUSES[status].color + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  }),
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff'
  },
  empty: {
    color: '#777777',
    textAlign: 'center',
    paddingVertical: 24
  }
});
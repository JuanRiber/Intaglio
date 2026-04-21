/*
 * HomeScreen.js
 *
 * Esta tela é o coração do Nexo, onde o usuário acompanha seus serviços como
 * quem olha para a discografia do Black Sabbath: cada item tem sua história
 * e seu clima. Agora ela ficou mais inteligente, com busca, filtros e um painel
 * enxuto para o profissional enxergar o ritmo do dia.
 */

import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices, ServiceStatus } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';
import { formatCurrency, getServiceTotal, statusLabel } from '../utils/formatters';

const filterOptions = [
  { key: 'todos', label: 'Todos' },
  { key: ServiceStatus.AGUARDANDO, label: 'Aguardando' },
  { key: ServiceStatus.EM_SERVICO, label: 'Em serviço' },
  { key: ServiceStatus.PRONTO, label: 'Pronto' },
  { key: ServiceStatus.PAGO, label: 'Pago' },
];

export default function HomeScreen() {
  const { services, getMonthlyRevenue } = useServices();
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');

  const revenue = getMonthlyRevenue();

  const dashboard = useMemo(() => {
    const openServices = services.filter((service) => service.status !== ServiceStatus.PAGO).length;
    const waitingServices = services.filter((service) => service.status === ServiceStatus.AGUARDANDO).length;
    const paidServices = services.filter((service) => service.status === ServiceStatus.PAGO).length;

    return {
      total: services.length,
      openServices,
      waitingServices,
      paidServices,
    };
  }, [services]);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services
      .filter((service) => {
        if (activeFilter === 'todos') {
          return true;
        }

        return service.status === activeFilter;
      })
      .filter((service) => {
        if (!normalizedSearch) {
          return true;
        }

        return [service.cliente, service.equipamento, service.problema]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [activeFilter, search, services]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detalhes do Serviço', { serviceId: item.id })}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cliente}>{item.cliente}</Text>
            <Text style={styles.equipamento}>{item.equipamento}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{statusLabel(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.problemText} numberOfLines={2}>
          {item.problema || 'Sem descrição registrada.'}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(getServiceTotal(item))}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.greetingCard}>
        <Text style={styles.greetingEyebrow}>Bem-vindo de volta</Text>
        <Text style={styles.greetingTitle}>{currentUser?.nome ? `${currentUser.nome.split(' ')[0]}, o palco é seu.` : 'Seu painel do Nexo'}</Text>
      </View>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Painel Nexo</Text>
        <Text style={styles.heroTitle}>Faturamento do mês</Text>
        <Text style={styles.heroValue}>{formatCurrency(revenue)}</Text>
        <Text style={styles.heroSubtitle}>
          Controle simples, direto e sem ruído para acompanhar o compasso do trabalho.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboard.total}</Text>
          <Text style={styles.statLabel}>Serviços</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboard.openServices}</Text>
          <Text style={styles.statLabel}>Em aberto</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dashboard.waitingServices}</Text>
          <Text style={styles.statLabel}>Aguardando</Text>
        </View>
      </View>

      <TextInput
        placeholder="Buscar por cliente, equipamento ou problema"
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filterOptions}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersList}
        renderItem={({ item }) => {
          const isActive = item.key === activeFilter;
          return (
            <TouchableOpacity
              onPress={() => setActiveFilter(item.key)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nada por aqui.</Text>
          <Text style={styles.emptyText}>
            Ajuste a busca, troque o filtro ou registre um novo serviço para seguir o fluxo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  heroValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.white,
    marginBottom: 12,
  },
  filtersList: {
    maxHeight: 42,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cliente: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  equipamento: {
    color: colors.textMuted,
    fontSize: 13,
  },
  badge: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  problemText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  totalValue: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
});

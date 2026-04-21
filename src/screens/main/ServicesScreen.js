import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/theme';
import { useServices, ServiceStatus } from '../../context/ServicesContext';
import { formatCurrency, getServiceTotal, statusLabel } from '../../utils/formatters';

const statusFiltersCeltic = [
  { key: 'todos', label: 'Todos' },
  { key: ServiceStatus.AGUARDANDO, label: 'Aguardando' },
  { key: ServiceStatus.EM_SERVICO, label: 'Em serviço' },
  { key: ServiceStatus.PRONTO, label: 'Pronto' },
  { key: ServiceStatus.PAGO, label: 'Pago' },
];

export default function ServicesScreen() {
  const navigation = useNavigation();
  const { services } = useServices();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');

  const visibleServices = useMemo(() => {
    const normalizedText = searchText.trim().toLowerCase();

    return [...services]
      .filter((service) => activeFilter === 'todos' || service.status === activeFilter)
      .filter((service) => {
        if (!normalizedText) return true;
        return [service.cliente, service.equipamento, service.problema]
          .filter(Boolean)
          .some((item) => item.toLowerCase().includes(normalizedText));
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [activeFilter, searchText, services]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Serviços</Text>
          <Text style={styles.subtitle}>Acompanhe a fila completa e entre nos detalhes quando precisar.</Text>
        </View>
        <TouchableOpacity style={styles.newButton} onPress={() => navigation.getParent()?.navigate('Novo serviço')}>
          <Text style={styles.newButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Buscar por cliente, equipamento ou problema"
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
      />

      <FlatList
        horizontal
        data={statusFiltersCeltic}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const isActive = item.key === activeFilter;
          return (
            <TouchableOpacity style={[styles.filterChip, isActive && styles.filterChipActive]} onPress={() => setActiveFilter(item.key)}>
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={visibleServices}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
            <Text style={styles.emptyText}>Tente outro filtro, ajuste a busca ou registre um novo atendimento.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.getParent()?.navigate('Detalhes do Serviço', { serviceId: item.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceTitle}>{item.cliente}</Text>
              <Text style={styles.serviceSubtitle}>{item.equipamento}</Text>
              <Text style={styles.problemText} numberOfLines={2}>{item.problema || 'Sem descrição registrada.'}</Text>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.serviceStatus}>{statusLabel(item.status)}</Text>
              <Text style={styles.serviceValue}>{formatCurrency(getServiceTotal(item))}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 20, maxWidth: 250 },
  newButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 },
  newButtonText: { color: colors.white, fontWeight: '700' },
  searchInput: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.white, borderRadius: 14, padding: 14, marginBottom: 12 },
  filterList: { paddingBottom: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { color: colors.textMuted, fontWeight: '700' },
  filterChipTextActive: { color: colors.white },
  serviceCard: { flexDirection: 'row', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginBottom: 10 },
  serviceTitle: { color: colors.white, fontWeight: '700', marginBottom: 4 },
  serviceSubtitle: { color: colors.textMuted, marginBottom: 6 },
  problemText: { color: colors.textMuted, lineHeight: 18 },
  serviceRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  serviceStatus: { color: colors.accent, fontWeight: '700' },
  serviceValue: { color: colors.white, fontWeight: '700' },
  emptyBox: { marginTop: 40, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 18 },
  emptyTitle: { color: colors.white, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: colors.textMuted, lineHeight: 20 },
});

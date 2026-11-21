import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices, SERVICE_STATUSES, getStatusInfo } from '../../context/ServicesContext';
import { palette, radii, shadowCard } from '../../theme/palette';
import { formatCurrency, getServiceTotals } from '../../utils/format';

export default function ServicesScreen() {
  const navigation = useNavigation();
  const { services } = useServices();
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');

  const filteredServices = useMemo(() => {
    return services
      .filter((svc) => selectedStatus === 'TODOS' || svc.status === selectedStatus)
      .filter((svc) => {
        const q = query.trim().toLowerCase();
        return (
          svc.clientName.toLowerCase().includes(q) ||
          svc.equipment.toLowerCase().includes(q) ||
          svc.problem.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [services, query, selectedStatus]);

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <View style={styles.avatarBox}>
        <Text style={styles.avatarText}>{item.clientName?.slice(0, 1)?.toUpperCase() || 'N'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemClient}>{item.equipment}</Text>
        <Text style={styles.itemSub}>{item.clientName}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(getServiceTotals(item).total)}</Text>
      </View>
      <View style={styles.itemStatus(item.status)}>
        <Text style={styles.itemStatusText}>{getStatusInfo(item.status).label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar serviços..."
        placeholderTextColor="#8E897E"
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filterRow}>
        {['TODOS', ...Object.keys(SERVICE_STATUSES)].map((statusKey) => {
          const isActive = selectedStatus === statusKey;
          return (
            <TouchableOpacity
              key={statusKey}
              onPress={() => setSelectedStatus(statusKey)}
              style={[styles.filterButton, isActive && styles.filterButtonActive]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {statusKey === 'TODOS' ? 'Todos' : SERVICE_STATUSES[statusKey].label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderService}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.snow, padding: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    marginBottom: 12
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    marginRight: 8,
    marginBottom: 8
  },
  filterButtonActive: {
    backgroundColor: palette.gold,
    borderColor: '#B88624'
  },
  filterText: { color: palette.textSoft, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: palette.ink },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
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
  itemClient: { color: palette.text, fontSize: 15, fontWeight: '700' },
  itemSub: { color: palette.textSoft, fontSize: 13, marginTop: 3 },
  itemPrice: { color: palette.text, fontSize: 13, marginTop: 6, fontWeight: '600' },
  itemStatus: (status) => ({
    backgroundColor: getStatusInfo(status).color + '22',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  }),
  itemStatusText: { color: palette.text, fontSize: 11, fontWeight: '700' },
  empty: { color: palette.textSoft, textAlign: 'center', marginTop: 24 }
});

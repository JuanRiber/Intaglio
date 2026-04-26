import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices, SERVICE_STATUSES } from '../../context/ServicesContext';
import PrimaryButton from '../../components/PrimaryButton';

/**
 * ServicesScreen lista todos os serviços cadastrados, permitindo busca
 * textual e filtro por status. Cada item pode ser selecionado para
 * visualizar detalhes. Um botão fixo facilita a criação de novos
 * serviços.
 */
export default function ServicesScreen() {
  const navigation = useNavigation();
  const { services } = useServices();
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');

  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      if (selectedStatus !== 'TODOS' && svc.status !== selectedStatus) {
        return false;
      }
      const q = query.toLowerCase();
      return (
        svc.clientName.toLowerCase().includes(q) ||
        svc.equipment.toLowerCase().includes(q) ||
        svc.problem.toLowerCase().includes(q)
      );
    });
  }, [services, query, selectedStatus]);

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ServiceDetail', {
          serviceId: item.id
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.itemClient}>{item.clientName}</Text>
        <Text style={styles.itemEquipment}>{item.equipment}</Text>
      </View>
      <View style={styles.itemStatus(item.status)}>
        <Text style={styles.itemStatusText}>{SERVICE_STATUSES[item.status].label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar serviço..."
          placeholderTextColor="#777777"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View style={styles.filterRow}>
        {['TODOS', ...Object.keys(SERVICE_STATUSES)].map((statusKey) => {
          const isActive = selectedStatus === statusKey;
          return (
            <TouchableOpacity
              key={statusKey}
              onPress={() => setSelectedStatus(statusKey)}
              style={isActive ? styles.filterButtonActive : styles.filterButton}
            >
              <Text style={isActive ? styles.filterTextActive : styles.filterText}>
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
        style={{ flex: 1 }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço encontrado.</Text>}
      />
      <PrimaryButton
        title="Adicionar"
        onPress={() => navigation.navigate('NewService')}
        style={styles.addButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 16
  },
  searchContainer: {
    marginBottom: 8
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff'
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    marginRight: 8,
    marginBottom: 8
  },
  filterButtonActive: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#006aff',
    marginRight: 8,
    marginBottom: 8
  },
  filterText: {
    color: '#cccccc',
    fontSize: 12
  },
  filterTextActive: {
    color: '#ffffff',
    fontSize: 12
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222'
  },
  itemClient: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  itemEquipment: {
    color: '#888888',
    fontSize: 14
  },
  itemStatus: (status) => ({
    backgroundColor: SERVICE_STATUSES[status].color + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  }),
  itemStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff'
  },
  empty: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 24
  },
  addButton: {
    marginTop: 12
  }
});
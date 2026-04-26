import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices } from '../../context/ServicesContext';

/**
 * ClientsScreen lista clientes com base nos serviços cadastrados. Exibe
 * quantos serviços cada cliente possui e permite busca simples.
 */
export default function ClientsScreen() {
  const navigation = useNavigation();
  const { services } = useServices();
  const [query, setQuery] = useState('');

  // Agrupa serviços por cliente
  const clients = useMemo(() => {
    const map = new Map();
    services.forEach((svc) => {
      const key = `${svc.clientName}|${svc.phone || ''}`;
      if (!map.has(key)) {
        map.set(key, { name: svc.clientName, phone: svc.phone, count: 0 });
      }
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  const filtered = clients.filter((cl) => cl.name.toLowerCase().includes(query.toLowerCase()));

  const renderClient = ({ item }) => (
    <View style={styles.clientItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.clientName}>{item.name}</Text>
        {item.phone ? <Text style={styles.clientPhone}>{item.phone}</Text> : null}
      </View>
      <View style={styles.clientCountBadge}>
        <Text style={styles.clientCountText}>{item.count} serviço{item.count > 1 ? 's' : ''}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cliente..."
        placeholderTextColor="#777777"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name + item.phone}
        renderItem={renderClient}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cliente encontrado.</Text>}
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    marginBottom: 12
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222'
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff'
  },
  clientPhone: {
    fontSize: 14,
    color: '#888888'
  },
  clientCountBadge: {
    backgroundColor: '#006aff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  clientCountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  empty: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 24
  }
});
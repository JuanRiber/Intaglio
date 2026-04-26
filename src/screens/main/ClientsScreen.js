import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import { palette, radii, shadowCard } from '../../theme/palette';

export default function ClientsScreen() {
  const { services } = useServices();
  const [query, setQuery] = useState('');

  const clients = useMemo(() => {
    const map = new Map();
    services.forEach((svc) => {
      const key = `${svc.clientName}|${svc.phone || ''}`;
      if (!map.has(key)) map.set(key, { name: svc.clientName, phone: svc.phone, count: 0 });
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  const filtered = clients.filter((cl) => cl.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cliente..."
        placeholderTextColor="#8E897E"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name + item.phone}
        renderItem={({ item }) => (
          <View style={styles.clientItem}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{item.name?.slice(0,1)?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.clientName}>{item.name}</Text>
              {item.phone ? <Text style={styles.clientPhone}>{item.phone}</Text> : null}
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.count}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cliente encontrado.</Text>}
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
  clientItem: {
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
  clientName: { fontSize: 15, fontWeight: '700', color: palette.text },
  clientPhone: { fontSize: 13, color: palette.textSoft, marginTop: 3 },
  badge: { backgroundColor: palette.gold, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: palette.ink, fontWeight: '700', fontSize: 12 },
  empty: { color: palette.textSoft, textAlign: 'center', marginTop: 24 }
});

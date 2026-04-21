import React, { useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import SectionCard from '../../components/SectionCard';
import { useServices } from '../../context/ServicesContext';
import { formatPhone } from '../../utils/formatters';

export default function ClientsScreen() {
  const { services } = useServices();

  const clientRegistryCernunnos = useMemo(() => {
    const map = new Map();

    services.forEach((service) => {
      const key = `${service.cliente}-${service.telefone}`;
      const current = map.get(key) || {
        nome: service.cliente,
        telefone: service.telefone,
        equipamentos: new Set(),
        quantidade: 0,
      };

      current.quantidade += 1;
      if (service.equipamento) {
        current.equipamentos.add(service.equipamento);
      }
      map.set(key, current);
    });

    return Array.from(map.values()).map((client) => ({
      ...client,
      equipamentos: Array.from(client.equipamentos),
    }));
  }, [services]);

  function openClientWhatsapp(phone) {
    if (!phone) return;
    Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`).catch(() => null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Clientes</Text>
      <Text style={styles.subtitle}>Uma base enxuta para saber quem já passou pelo seu fluxo e como voltar neles.</Text>

      {clientRegistryCernunnos.length === 0 ? (
        <SectionCard>
          <Text style={styles.emptyTitle}>Nenhum cliente ainda</Text>
          <Text style={styles.emptyText}>Os clientes aparecem aqui automaticamente conforme você registra serviços.</Text>
        </SectionCard>
      ) : (
        clientRegistryCernunnos.map((client) => (
          <SectionCard key={`${client.nome}-${client.telefone || client.quantidade}`} style={styles.clientCard}>
            <View style={styles.clientTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{client.nome}</Text>
                <Text style={styles.clientMeta}>{client.quantidade} serviço(s)</Text>
              </View>
              {client.telefone ? (
                <TouchableOpacity style={styles.whatsappButton} onPress={() => openClientWhatsapp(client.telefone)}>
                  <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <Text style={styles.clientPhone}>{client.telefone ? formatPhone(client.telefone) : 'Telefone não informado'}</Text>
            <Text style={styles.clientEquipments}>Equipamentos: {client.equipamentos.join(', ') || 'Sem dados'}</Text>
          </SectionCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 20, marginBottom: 14 },
  clientCard: { marginBottom: 12 },
  clientTopRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  clientName: { color: colors.white, fontWeight: '800', fontSize: 18, marginBottom: 4 },
  clientMeta: { color: colors.textMuted },
  whatsappButton: { backgroundColor: colors.success, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  whatsappButtonText: { color: colors.white, fontWeight: '700' },
  clientPhone: { color: colors.white, marginBottom: 6 },
  clientEquipments: { color: colors.textMuted, lineHeight: 20 },
  emptyTitle: { color: colors.white, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: colors.textMuted, lineHeight: 20 },
});

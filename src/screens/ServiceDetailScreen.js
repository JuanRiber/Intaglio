/*
 * ServiceDetailScreen.js
 *
 * Nesta tela mergulhamos nos detalhes de um serviço, como as letras
 * introspectivas de Nietzsche e Jung. Permitimos alterar o status e
 * visualizar o orçamento com peças e mão de obra. Também oferecemos um atalho
 * para falar com o cliente via WhatsApp – abrindo portas como The Doors.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useServices, ServiceStatus } from '../context/ServicesContext';

export default function ServiceDetailScreen() {
  const route = useRoute();
  const { serviceId } = route.params || {};
  const { services, updateStatus } = useServices();

  const service = services.find((svc) => svc.id === serviceId);
  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Serviço não encontrado.</Text>
      </View>
    );
  }

  const { cliente, telefone, equipamento, problema, pecas, maoDeObra, status, paidAt } = service;

  const totalPecas = Array.isArray(pecas)
    ? pecas.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)
    : 0;
  const total = totalPecas + parseFloat(maoDeObra || 0);

  const statusOptions = [
    { value: ServiceStatus.AGUARDANDO, label: 'Aguardando' },
    { value: ServiceStatus.EM_SERVICO, label: 'Em serviço' },
    { value: ServiceStatus.PRONTO, label: 'Pronto' },
    { value: ServiceStatus.ENTREGUE, label: 'Entregue' },
    { value: ServiceStatus.PAGO, label: 'Pago' },
  ];

  function handleStatusChange(newStatus) {
    updateStatus(service.id, newStatus);
  }

  function handleWhatsApp() {
    if (!telefone) {
      Alert.alert('Telefone não informado');
      return;
    }
    const msg = encodeURIComponent(
      `Olá ${cliente}, aqui está o orçamento para o serviço do seu ${equipamento}:\nValor total: R$ ${total.toFixed(2)}.\nStatus atual: ${status}.` +
        '\n\nEnviado via Nexo – inspirado em Led Zeppelin, Black Sabbath e The Doors.'
    );
    const url = `https://wa.me/${telefone.replace(/\D/g, '')}?text=${msg}`;
    Linking.openURL(url).catch(() => Alert.alert('Não foi possível abrir o WhatsApp.'));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes do serviço</Text>
      <Text style={styles.label}>Cliente:</Text>
      <Text style={styles.value}>{cliente}</Text>
      {telefone ? (
        <>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.value}>{telefone}</Text>
        </>
      ) : null}
      <Text style={styles.label}>Equipamento:</Text>
      <Text style={styles.value}>{equipamento}</Text>
      {problema ? (
        <>
          <Text style={styles.label}>Problema:</Text>
          <Text style={styles.value}>{problema}</Text>
        </>
      ) : null}
      <Text style={styles.sectionTitle}>Peças</Text>
      {Array.isArray(pecas) && pecas.length > 0 ? (
        pecas.map((p, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemText}>{p.descricao}</Text>
            <Text style={styles.itemText}>R$ {parseFloat(p.valor).toFixed(2)}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>Nenhuma peça registrada.</Text>
      )}
      <View style={styles.itemRow}>
        <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Mão de obra</Text>
        <Text style={[styles.itemText, { fontWeight: 'bold' }]}>R$ {parseFloat(maoDeObra || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Total</Text>
        <Text style={[styles.itemText, { fontWeight: 'bold' }]}>R$ {total.toFixed(2)}</Text>
      </View>
      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.statusContainer}>
        {statusOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => handleStatusChange(opt.value)}
            style={[
              styles.statusButton,
              status === opt.value && styles.statusButtonActive,
            ]}
          >
            <Text style={[styles.statusButtonText, status === opt.value && styles.statusButtonTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {status !== ServiceStatus.PAGO ? (
        <TouchableOpacity onPress={() => handleStatusChange(ServiceStatus.PAGO)} style={styles.payButton}>
          <Text style={styles.payButtonText}>Marcar como pago</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.paidAt}>Pago em {paidAt ? new Date(paidAt).toLocaleDateString() : 'data indefinida'}</Text>
      )}
      <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsButton}>
        <Text style={styles.whatsButtonText}>Enviar orçamento via WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0066cc',
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: '#0066cc',
  },
  statusButtonText: {
    color: '#0066cc',
    fontSize: 12,
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  payButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paidAt: {
    fontSize: 14,
    color: '#28a745',
    marginVertical: 8,
  },
  whatsButton: {
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  whatsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
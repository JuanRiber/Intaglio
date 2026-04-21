/*
 * ServiceDetailScreen.js
 *
 * Nesta tela mergulhamos nos detalhes de um serviço, como as letras
 * introspectivas de Nietzsche e Jung. Permitimos alterar o status, editar,
 * excluir e visualizar o orçamento de forma mais clara.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useServices, ServiceStatus } from '../context/ServicesContext';
import { colors } from '../constants/theme';
import { formatCurrency, formatPhone, getServiceTotal, statusLabel } from '../utils/formatters';

export default function ServiceDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceId } = route.params || {};
  const { services, updateStatus, deleteService } = useServices();

  const service = services.find((svc) => svc.id === serviceId);
  if (!service) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundText}>Serviço não encontrado.</Text>
      </View>
    );
  }

  const { cliente, telefone, equipamento, problema, pecas, maoDeObra, status, paidAt } = service;
  const totalPecas = Array.isArray(pecas)
    ? pecas.reduce((sum, p) => sum + Number(p.valor || 0), 0)
    : 0;
  const total = getServiceTotal(service);

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

    const message = encodeURIComponent(
      [
        `Olá ${cliente}, segue o resumo do seu serviço no Nexo.`,
        `Equipamento: ${equipamento}`,
        `Status: ${statusLabel(status)}`,
        `Peças: ${formatCurrency(totalPecas)}`,
        `Mão de obra: ${formatCurrency(maoDeObra)}`,
        `Total: ${formatCurrency(total)}`,
      ].join('\n')
    );

    const url = `https://wa.me/${telefone.replace(/\D/g, '')}?text=${message}`;
    Linking.openURL(url).catch(() => Alert.alert('Não foi possível abrir o WhatsApp.'));
  }

  function handleDelete() {
    Alert.alert(
      'Excluir serviço',
      'Essa ação remove o serviço do app. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteService(service.id);
            navigation.navigate('Home');
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{cliente}</Text>
        <Text style={styles.heroSubtitle}>{equipamento}</Text>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{statusLabel(status)}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <InfoRow label="Cliente" value={cliente} />
        <InfoRow label="Telefone" value={telefone ? formatPhone(telefone) : 'Não informado'} />
        <InfoRow label="Equipamento" value={equipamento} />
        <InfoRow label="Problema" value={problema || 'Sem descrição registrada.'} multiline />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Orçamento</Text>
        {Array.isArray(pecas) && pecas.length > 0 ? (
          pecas.map((piece, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemText}>{piece.descricao}</Text>
              <Text style={styles.itemValue}>{formatCurrency(piece.valor)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyPieces}>Nenhuma peça registrada.</Text>
        )}

        <View style={[styles.itemRow, styles.summaryRow]}>
          <Text style={styles.summaryLabel}>Subtotal peças</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPecas)}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.summaryLabel}>Mão de obra</Text>
          <Text style={styles.summaryValue}>{formatCurrency(maoDeObra)}</Text>
        </View>
        <View style={[styles.itemRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total final</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Fluxo do serviço</Text>
        <View style={styles.statusContainer}>
          {statusOptions.map((option) => {
            const isActive = status === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleStatusChange(option.value)}
                style={[styles.statusButton, isActive && styles.statusButtonActive]}
              >
                <Text style={[styles.statusButtonText, isActive && styles.statusButtonTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {status === ServiceStatus.PAGO && (
          <Text style={styles.paidAt}>Pago em {paidAt ? new Date(paidAt).toLocaleDateString('pt-BR') : 'data indefinida'}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Editar Serviço', { serviceId: service.id })}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>Editar serviço</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsButton}>
        <Text style={styles.buttonText}>Enviar orçamento via WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Excluir serviço</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value, multiline = false }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, multiline && styles.infoValueMultiline]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    color: colors.white,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: colors.textMuted,
    marginBottom: 10,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  infoValue: {
    color: colors.white,
    fontSize: 15,
  },
  infoValueMultiline: {
    lineHeight: 21,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    color: colors.white,
    flex: 1,
    paddingRight: 12,
  },
  itemValue: {
    color: colors.textMuted,
  },
  emptyPieces: {
    color: colors.textMuted,
    marginBottom: 12,
  },
  summaryRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.white,
    fontWeight: '700',
  },
  totalRow: {
    marginBottom: 0,
    marginTop: 2,
  },
  totalLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  totalValue: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '800',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  statusButtonTextActive: {
    color: colors.white,
  },
  paidAt: {
    color: colors.success,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  whatsButton: {
    backgroundColor: '#25D366',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '800',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useServices, SERVICE_STATUSES } from '../../context/ServicesContext';
import PrimaryButton from '../../components/PrimaryButton';

/**
 * ServiceDetailScreen exibe todas as informações de um serviço específico.
 * Permite editar, excluir, alterar status e compartilhar orçamento via
 * WhatsApp. Os dados são obtidos a partir do contexto de serviços.
 */
export default function ServiceDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceId } = route.params || {};
  const { services, updateStatus, deleteService } = useServices();
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#ffffff' }}>Serviço não encontrado.</Text>
      </View>
    );
  }

  const nextStatusOrder = ['AGUARDANDO', 'EM_SERVICO', 'PRONTO', 'ENTREGUE', 'PAGO'];
  const currentIndex = nextStatusOrder.indexOf(service.status);
  const hasNext = currentIndex >= 0 && currentIndex < nextStatusOrder.length - 1;
  const nextStatus = hasNext ? nextStatusOrder[currentIndex + 1] : null;

  const handleAdvanceStatus = () => {
    if (hasNext && nextStatus) {
      updateStatus(service.id, nextStatus);
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir serviço', 'Tem certeza que deseja excluir este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteService(service.id);
          navigation.goBack();
        }
      }
    ]);
  };

  const handleShareWhatsApp = () => {
    // Monta mensagem com orçamento
    const partsTotal = service.parts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const total = partsTotal + (Number(service.labourCost) || 0);
    const message =
      `Olá ${service.clientName}!\n` +
      `Segue o orçamento para o serviço no equipamento ${service.equipment}.\n` +
      `Peças: R$ ${partsTotal.toFixed(2)}\n` +
      `Mão de obra: R$ ${service.labourCost.toFixed(2)}\n` +
      `Total: R$ ${total.toFixed(2)}\n` +
      `Status atual: ${SERVICE_STATUSES[service.status].label}.`;
    const url = `https://wa.me/${service.phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch((err) => console.warn('Erro ao abrir WhatsApp', err));
  };

  const partsTotal = service.parts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const total = partsTotal + (Number(service.labourCost) || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.inner}>
        <Text style={styles.title}>Detalhes do serviço</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{service.clientName}</Text>
        </View>
        {service.phone ? (
          <View style={styles.row}>
            <Text style={styles.label}>Telefone:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${service.phone}`)}>
              <Text style={[styles.value, { color: '#00BFFF' }]}>{service.phone}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Equipamento:</Text>
          <Text style={styles.value}>{service.equipment}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Problema:</Text>
          <Text style={styles.value}>{service.problem || '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peças</Text>
          {service.parts.map((part, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.value}>{part.description}</Text>
              <Text style={styles.value}>R$ {part.price.toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal de peças:</Text>
            <Text style={styles.value}>R$ {partsTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mão de obra:</Text>
          <Text style={styles.value}>R$ {service.labourCost.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>R$ {total.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <View style={styles.statusBadge(service.status)}>
            <Text style={styles.statusText}>{SERVICE_STATUSES[service.status].label}</Text>
          </View>
        </View>
        {hasNext && (
          <PrimaryButton
            title={`Avançar para ${SERVICE_STATUSES[nextStatus].label}`}
            onPress={handleAdvanceStatus}
            style={{ marginTop: 16 }}
          />
        )}
        {service.status !== 'PAGO' && !hasNext && (
          // Caso o status seja desconhecido ou já pago
          <Text style={{ color: '#777777', marginTop: 16 }}>Status final alcançado.</Text>
        )}
        <PrimaryButton
          title="Editar"
          onPress={() => navigation.navigate('EditService', { serviceId: service.id })}
          style={{ marginTop: 16 }}
        />
        <PrimaryButton
          title="Excluir"
          onPress={handleDelete}
          style={{ marginTop: 12, backgroundColor: '#e74c3c' }}
        />
        {service.phone ? (
          <PrimaryButton
            title="Enviar orçamento via WhatsApp"
            onPress={handleShareWhatsApp}
            style={{ marginTop: 12, backgroundColor: '#34af23' }}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 16
  },
  inner: {
    paddingVertical: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  label: {
    color: '#888888',
    fontSize: 14
  },
  value: {
    color: '#ffffff',
    fontSize: 14
  },
  section: {
    marginTop: 16,
    marginBottom: 8
  },
  sectionTitle: {
    color: '#cccccc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  statusBadge: (status) => ({
    backgroundColor: SERVICE_STATUSES[status].color + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  }),
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  }
});
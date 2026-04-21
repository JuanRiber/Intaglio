/*
 * HomeScreen.js
 *
 * Esta tela é o coração do Nexo, onde o usuário acompanha seus serviços como
 * quem olha para a discografia do Black Sabbath: cada item tem sua história
 * e seu clima. Mostramos também o faturamento mensal, uma espécie de
 * "Stairway to Heaven" financeira, ajudando o autônomo a se orientar.
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServices, ServiceStatus } from '../context/ServicesContext';

export default function HomeScreen() {
  const { services, getMonthlyRevenue } = useServices();
  const navigation = useNavigation();

  const revenue = getMonthlyRevenue();

  // Formata o status para exibição, inspirado na poesia existencial de
  // Nietzsche: simples e direto ao ponto.
  function formatStatus(status) {
    switch (status) {
      case ServiceStatus.AGUARDANDO:
        return 'Aguardando';
      case ServiceStatus.EM_SERVICO:
        return 'Em serviço';
      case ServiceStatus.PRONTO:
        return 'Pronto';
      case ServiceStatus.ENTREGUE:
        return 'Entregue';
      case ServiceStatus.PAGO:
        return 'Pago';
      default:
        return status;
    }
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detalhes do Serviço', { serviceId: item.id })}
        style={styles.card}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cliente}>{item.cliente}</Text>
          <Text style={styles.equipamento}>{item.equipamento}</Text>
        </View>
        <Text style={styles.status}>{formatStatus(item.status)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.revenueContainer}>
        <Text style={styles.revenueTitle}>Faturamento deste mês</Text>
        <Text style={styles.revenueValue}>R$ {revenue.toFixed(2)}</Text>
      </View>
      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum serviço cadastrado ainda. Como diria Jim Morrison, "There are
            things known and things unknown; and in between are the doors" — que
            tal abrir a porta e registrar seu primeiro serviço?
          </Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  revenueContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  cliente: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  equipamento: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
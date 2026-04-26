import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useServices } from '../../context/ServicesContext';
import SectionCard from '../../components/SectionCard';

/**
 * FinanceScreen apresenta um resumo financeiro dos serviços pagos. Exibe
 * o faturamento do mês, o total geral e uma lista de serviços pagos com
 * seus respectivos valores.
 */
export default function FinanceScreen() {
  const { services, summary } = useServices();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const { paidServices, totalRevenue } = useMemo(() => {
    let total = 0;
    const list = [];
    services.forEach((svc) => {
      if (svc.status === 'PAGO' && svc.paidAt) {
        const partsTotal = svc.parts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
        const serviceTotal = partsTotal + (Number(svc.labourCost) || 0);
        total += serviceTotal;
        list.push({
          id: svc.id,
          client: svc.clientName,
          equipment: svc.equipment,
          total: serviceTotal,
          paidAt: svc.paidAt
        });
      }
    });
    list.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
    return { paidServices: list, totalRevenue: total };
  }, [services]);

  const paidThisMonth = paidServices.filter((svc) => {
    const dt = new Date(svc.paidAt);
    return dt.getFullYear() === currentYear && dt.getMonth() === currentMonth;
  });

  return (
    <View style={styles.container}>
      <SectionCard>
        <Text style={styles.cardTitle}>Faturamento do mês</Text>
        <Text style={styles.cardValue}>R$ {summary.monthlyRevenue.toFixed(2)}</Text>
        <Text style={styles.cardSub}>Serviços pagos este mês: {paidThisMonth.length}</Text>
      </SectionCard>
      <SectionCard>
        <Text style={styles.cardTitle}>Faturamento total</Text>
        <Text style={styles.cardValue}>R$ {totalRevenue.toFixed(2)}</Text>
        <Text style={styles.cardSub}>Serviços pagos no total: {paidServices.length}</Text>
      </SectionCard>
      <Text style={styles.listTitle}>Pagamentos recentes</Text>
      <FlatList
        data={paidServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentClient}>{item.client}</Text>
              <Text style={styles.paymentEquipment}>{item.equipment}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.paymentTotal}>R$ {item.total.toFixed(2)}</Text>
              <Text style={styles.paymentDate}>{new Date(item.paidAt).toLocaleDateString()}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço pago.</Text>}
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
  cardTitle: {
    fontSize: 16,
    color: '#aaaaaa'
  },
  cardValue: {
    fontSize: 28,
    color: '#27ae60',
    fontWeight: '700'
  },
  cardSub: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4
  },
  listTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginVertical: 12
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222222'
  },
  paymentClient: {
    fontSize: 16,
    color: '#ffffff'
  },
  paymentEquipment: {
    fontSize: 14,
    color: '#888888'
  },
  paymentTotal: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600'
  },
  paymentDate: {
    fontSize: 12,
    color: '#888888'
  },
  empty: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 24
  }
});
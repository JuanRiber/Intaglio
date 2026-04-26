import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * ServicesContext gerencia a lista de serviços cadastrados no Nexo. Cada
 * serviço possui informações sobre o cliente, equipamento, problema,
 * peças utilizadas, mão de obra e status. As ações disponíveis incluem
 * adicionar, editar, excluir e alterar status, incluindo marcar como
 * pago. Todos os dados são persistidos em AsyncStorage.
 */

const SERVICES_KEY = 'nexo_athena_services';

// Definição de status com rótulo e cor. Os nomes das chaves referem-se a
// divindades gregas e celtas de forma discreta, mantendo legibilidade.
export const SERVICE_STATUSES = {
  AGUARDANDO: { label: 'Aguardando', color: '#F1C40F' },
  EM_SERVICO: { label: 'Em serviço', color: '#3498DB' },
  PRONTO: { label: 'Pronto', color: '#9B59B6' },
  ENTREGUE: { label: 'Entregue', color: '#2ECC71' },
  PAGO: { label: 'Pago', color: '#27AE60' }
};

const initialState = [];

function servicesReducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICES':
      return action.payload;
    case 'ADD_SERVICE':
      return [...state, action.payload];
    case 'EDIT_SERVICE':
      return state.map((svc) =>
        svc.id === action.payload.id ? { ...svc, ...action.payload.updates, updatedAt: new Date().toISOString() } : svc
      );
    case 'DELETE_SERVICE':
      return state.filter((svc) => svc.id !== action.payload);
    case 'UPDATE_STATUS':
      return state.map((svc) => {
        if (svc.id !== action.payload.id) return svc;
        const updated = { ...svc, status: action.payload.status, updatedAt: new Date().toISOString() };
        if (action.payload.status === 'PAGO') {
          updated.paidAt = new Date().toISOString();
        }
        return updated;
      });
    default:
      return state;
  }
}

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [services, dispatch] = useReducer(servicesReducer, initialState);
  const isLoadedRef = React.useRef(false);

  // Carrega serviços salvos no armazenamento ao inicializar
  useEffect(() => {
    async function loadServices() {
      try {
        const raw = await AsyncStorage.getItem(SERVICES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'SET_SERVICES', payload: parsed });
          }
        }
      } catch (err) {
        console.warn('Falha ao restaurar serviços', err);
      } finally {
        isLoadedRef.current = true;
      }
    }
    loadServices();
  }, []);

  // Persiste serviços sempre que a lista mudar após o carregamento inicial
  useEffect(() => {
    if (!isLoadedRef.current) return;
    AsyncStorage.setItem(SERVICES_KEY, JSON.stringify(services)).catch((err) => {
      console.warn('Erro ao salvar serviços', err);
    });
  }, [services]);

  const addService = useCallback((data) => {
    const id = uuidv4();
    const newService = {
      id,
      clientName: data.clientName.trim(),
      phone: data.phone.trim(),
      equipment: data.equipment.trim(),
      problem: data.problem.trim(),
      parts: data.parts.map((p) => ({ description: p.description.trim(), price: Number(p.price) || 0 })),
      labourCost: Number(data.labourCost) || 0,
      status: 'AGUARDANDO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: null
    };
    dispatch({ type: 'ADD_SERVICE', payload: newService });
  }, []);

  const editService = useCallback((id, updates) => {
    dispatch({ type: 'EDIT_SERVICE', payload: { id, updates } });
  }, []);

  const deleteService = useCallback((id) => {
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  }, []);

  const updateStatus = useCallback((id, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  }, []);

  // Total de serviços no mês atual, receitas e contagem por status
  const summary = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    let monthlyRevenue = 0;
    const counts = {
      AGUARDANDO: 0,
      EM_SERVICO: 0,
      PRONTO: 0,
      ENTREGUE: 0,
      PAGO: 0
    };
    services.forEach((svc) => {
      counts[svc.status] += 1;
      if (svc.status === 'PAGO' && svc.paidAt) {
        const dt = new Date(svc.paidAt);
        if (dt.getFullYear() === currentYear && dt.getMonth() === currentMonth) {
          const partsTotal = svc.parts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
          monthlyRevenue += partsTotal + (Number(svc.labourCost) || 0);
        }
      }
    });
    return { monthlyRevenue, counts };
  }, [services]);

  const value = useMemo(
    () => ({
      services,
      addService,
      editService,
      deleteService,
      updateStatus,
      summary
    }),
    [services, addService, editService, deleteService, updateStatus, summary]
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error('useServices deve ser usado dentro de um ServicesProvider');
  }
  return ctx;
}
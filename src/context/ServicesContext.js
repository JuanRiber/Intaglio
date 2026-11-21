import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServiceTotals, isSameMonth } from '../utils/format';

/**
 * ServicesContext gerencia a lista de serviços cadastrados no Nexo. Cada
 * serviço possui informações sobre o cliente, equipamento, problema,
 * peças utilizadas, mão de obra e status. As ações disponíveis incluem
 * adicionar, editar, excluir e alterar status, incluindo marcar como
 * pago. Todos os dados são persistidos em AsyncStorage.
 */

const SERVICES_KEY = 'nexo_athena_services';

// Definição de status com rótulo e cor.
export const SERVICE_STATUSES = {
  AGUARDANDO: { label: 'Aguardando', color: '#F1C40F' },
  EM_SERVICO: { label: 'Em serviço', color: '#3498DB' },
  PRONTO: { label: 'Pronto', color: '#9B59B6' },
  ENTREGUE: { label: 'Entregue', color: '#2ECC71' },
  PAGO: { label: 'Pago', color: '#27AE60' }
};

// Ordem do fluxo de um serviço, do primeiro ao último status.
export const SERVICE_STATUS_ORDER = Object.keys(SERVICE_STATUSES);

// Devolve os dados do status, com um fallback para valores desconhecidos.
export function getStatusInfo(status) {
  return SERVICE_STATUSES[status] || { label: 'Aguardando', color: SERVICE_STATUSES.AGUARDANDO.color };
}

const initialState = [];

// Gera um identificador único sem depender de crypto.getRandomValues,
// que não existe por padrão no React Native.
function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeParts(parts) {
  return (Array.isArray(parts) ? parts : [])
    .map((p) => ({ description: String(p?.description || '').trim(), price: Number(p?.price) || 0 }))
    .filter((p) => p.description);
}

/**
 * Valida e normaliza um serviço lido do armazenamento. Retorna null quando
 * o registro está corrompido, para que ele não derrube as telas.
 */
function sanitizeService(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;
  const now = new Date().toISOString();
  const status = SERVICE_STATUSES[raw.status] ? raw.status : 'AGUARDANDO';
  return {
    id: String(raw.id),
    clientName: String(raw.clientName || '').trim() || 'Cliente sem nome',
    phone: String(raw.phone || ''),
    equipment: String(raw.equipment || ''),
    problem: String(raw.problem || ''),
    parts: Array.isArray(raw.parts)
      ? raw.parts.map((p) => ({ description: String(p?.description || ''), price: Number(p?.price) || 0 }))
      : [],
    labourCost: Number(raw.labourCost) || 0,
    status,
    createdAt: raw.createdAt || now,
    updatedAt: raw.updatedAt || raw.createdAt || now,
    paidAt: status === 'PAGO' ? raw.paidAt || raw.updatedAt || now : raw.paidAt || null
  };
}

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
      if (!SERVICE_STATUSES[action.payload.status]) return state;
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
            dispatch({ type: 'SET_SERVICES', payload: parsed.map(sanitizeService).filter(Boolean) });
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
    const newService = {
      id: generateId(),
      clientName: String(data.clientName || '').trim(),
      phone: String(data.phone || '').trim(),
      equipment: String(data.equipment || '').trim(),
      problem: String(data.problem || '').trim(),
      parts: normalizeParts(data.parts),
      labourCost: Number(data.labourCost) || 0,
      status: 'AGUARDANDO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: null
    };
    dispatch({ type: 'ADD_SERVICE', payload: newService });
  }, []);

  const editService = useCallback((id, updates) => {
    const safeUpdates = {
      clientName: String(updates.clientName || '').trim(),
      phone: String(updates.phone || '').trim(),
      equipment: String(updates.equipment || '').trim(),
      problem: String(updates.problem || '').trim(),
      parts: normalizeParts(updates.parts),
      labourCost: Number(updates.labourCost) || 0
    };
    dispatch({ type: 'EDIT_SERVICE', payload: { id, updates: safeUpdates } });
  }, []);

  const deleteService = useCallback((id) => {
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  }, []);

  const updateStatus = useCallback((id, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  }, []);

  // Receita do mês, contagem por status e serviços ainda em andamento
  const summary = useMemo(() => {
    const counts = Object.fromEntries(SERVICE_STATUS_ORDER.map((key) => [key, 0]));
    let monthlyRevenue = 0;
    let totalRevenue = 0;
    let paidThisMonth = 0;
    services.forEach((svc) => {
      counts[svc.status] += 1;
      if (svc.status === 'PAGO' && svc.paidAt) {
        const { total } = getServiceTotals(svc);
        totalRevenue += total;
        if (isSameMonth(svc.paidAt)) {
          monthlyRevenue += total;
          paidThisMonth += 1;
        }
      }
    });
    const activeCount = services.length - counts.PAGO;

    // Receita dos últimos 6 meses, do mais antigo para o atual
    const now = new Date();
    const history = Array.from({ length: 6 }, (_, i) => {
      const ref = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${ref.getFullYear()}-${ref.getMonth()}`,
        label: ref.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        reference: ref,
        revenue: 0
      };
    });
    services.forEach((svc) => {
      if (svc.status !== 'PAGO' || !svc.paidAt) return;
      const bucket = history.find((h) => isSameMonth(svc.paidAt, h.reference));
      if (bucket) bucket.revenue += getServiceTotals(svc).total;
    });

    return { monthlyRevenue, totalRevenue, paidThisMonth, activeCount, counts, history };
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
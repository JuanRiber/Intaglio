import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const ServiceStatus = {
  AGUARDANDO: 'aguardando',
  EM_SERVICO: 'em_servico',
  PRONTO: 'pronto',
  ENTREGUE: 'entregue',
  PAGO: 'pago',
};

const servicesKeyAthena = 'nexo_services_athena';
const ServicesContext = createContext(null);

const initialState = {
  services: [],
};

function servicesReducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICES':
      return { ...state, services: action.payload || [] };
    case 'ADD_SERVICE':
      return {
        ...state,
        services: [
          ...state.services,
          {
            ...action.payload,
            id: uuidv4(),
            status: ServiceStatus.AGUARDANDO,
            createdAt: new Date().toISOString(),
            paidAt: null,
          },
        ],
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id
            ? {
                ...service,
                status: action.payload.status,
                paidAt: action.payload.status === ServiceStatus.PAGO ? new Date().toISOString() : service.paidAt,
              }
            : service
        ),
      };
    case 'EDIT_SERVICE':
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? { ...service, ...action.payload.updates } : service
        ),
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ServicesProvider({ children }) {
  const [state, dispatch] = useReducer(servicesReducer, initialState);

  useEffect(() => {
    async function restoreServicesAthena() {
      try {
        const rawServices = await AsyncStorage.getItem(servicesKeyAthena);
        if (rawServices) {
          dispatch({ type: 'SET_SERVICES', payload: JSON.parse(rawServices) });
        }
      } catch (error) {
        console.warn('Falha ao restaurar serviços', error);
      }
    }

    restoreServicesAthena();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(servicesKeyAthena, JSON.stringify(state.services)).catch((error) => {
      console.warn('Falha ao salvar serviços', error);
    });
  }, [state.services]);

  function addService(serviceDraft) {
    dispatch({ type: 'ADD_SERVICE', payload: serviceDraft });
  }

  function updateStatus(id, status) {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  }

  function editService(id, updates) {
    dispatch({ type: 'EDIT_SERVICE', payload: { id, updates } });
  }

  function deleteService(id) {
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  }

  function getMonthlyRevenue() {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    return state.services
      .filter((service) => {
        if (service.status !== ServiceStatus.PAGO || !service.paidAt) return false;
        const paidDate = new Date(service.paidAt);
        return paidDate.getMonth() === month && paidDate.getFullYear() === year;
      })
      .reduce((sum, service) => {
        const partsTotal = Array.isArray(service.pecas)
          ? service.pecas.reduce((partsSum, piece) => partsSum + Number(piece.valor || 0), 0)
          : 0;
        return sum + Number(service.maoDeObra || 0) + partsTotal;
      }, 0);
  }

  return (
    <ServicesContext.Provider
      value={{
        services: state.services,
        addService,
        updateStatus,
        editService,
        deleteService,
        getMonthlyRevenue,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices deve ser usado dentro de um ServicesProvider');
  }
  return context;
}

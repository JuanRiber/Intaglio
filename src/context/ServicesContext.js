/*
 * ServicesContext.js
 *
 * Este contexto é a alma do aplicativo Nexo, como a filosofia de Carl Jung
 * influenciando nossas escolhas cotidianas. Aqui gerenciamos a lista de
 * serviços, permitindo criar novos registros, atualizar status e calcular o
 * faturamento mensal. É uma jornada que mistura organização com aquele lado
 * introspectivo do rock clássico.
 */

import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

// Definição dos status possíveis para um serviço. Mantemos tudo em minúsculas
// para facilitar comparações. Cada status representa uma etapa na jornada do
// serviço, como faixas em um álbum conceitual.
export const ServiceStatus = {
  AGUARDANDO: 'aguardando',
  EM_SERVICO: 'em_servico',
  PRONTO: 'pronto',
  ENTREGUE: 'entregue',
  PAGO: 'pago',
};

// Estado inicial: nenhuma receita, nenhuma dor de cabeça. Começamos com uma
// lista vazia de serviços, prontos para adicionar novos riffs.
const initialState = {
  // A lista é carregada do armazenamento assim que o aplicativo é iniciado. Até
  // lá, começamos com um array vazio.
  services: [],
};

// Reducer para manipular as ações. Como um groove do Black Sabbath, cada
// ação tem peso e propósito.
function servicesReducer(state, action) {
  switch (action.type) {
    case 'ADD_SERVICE': {
      const newService = { ...action.payload, id: uuidv4(), status: ServiceStatus.AGUARDANDO, createdAt: new Date(), paidAt: null };
      return { ...state, services: [...state.services, newService] };
    }
    case 'UPDATE_STATUS': {
      const { id, status } = action.payload;
      return {
        ...state,
        services: state.services.map((svc) =>
          svc.id === id ? { ...svc, status, paidAt: status === ServiceStatus.PAGO ? new Date() : svc.paidAt } : svc
        ),
      };
    }
    case 'EDIT_SERVICE': {
      const { id, updates } = action.payload;
      return {
        ...state,
        services: state.services.map((svc) =>
          svc.id === id ? { ...svc, ...updates } : svc
        ),
      };
    }
    case 'SET_SERVICES': {
      // Substitui a lista existente por aquela recuperada do armazenamento.
      return { ...state, services: action.payload || [] };
    }
    case 'DELETE_SERVICE': {
      return {
        ...state,
        services: state.services.filter((svc) => svc.id !== action.payload),
      };
    }
    default:
      return state;
  }
}

// Criação do contexto. Este será usado para compartilhar estado entre as telas.
const ServicesContext = createContext();

// Provider que envolve o app. Fornece funções para adicionar e atualizar
// serviços, além de calcular faturamento mensal.
export function ServicesProvider({ children }) {
  const [state, dispatch] = useReducer(servicesReducer, initialState);

  // Carrega os serviços do armazenamento local na inicialização.
  useEffect(() => {
    async function loadServices() {
      try {
        const stored = await AsyncStorage.getItem('nexo_services');
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({ type: 'SET_SERVICES', payload: parsed });
        }
      } catch (error) {
        console.warn('Falha ao carregar serviços do armazenamento', error);
      }
    }
    loadServices();
  }, []);

  // Salva a lista de serviços sempre que ela mudar.
  useEffect(() => {
    async function saveServices() {
      try {
        await AsyncStorage.setItem('nexo_services', JSON.stringify(state.services));
      } catch (error) {
        console.warn('Falha ao salvar serviços no armazenamento', error);
      }
    }
    saveServices();
  }, [state.services]);

  // Função para adicionar novo serviço. Detalhamos cada propriedade como
  // se estivéssemos compondo os versos de "Riders on the Storm" do The Doors.
  function addService({ cliente, telefone, equipamento, problema, pecas, maoDeObra }) {
    dispatch({
      type: 'ADD_SERVICE',
      payload: { cliente, telefone, equipamento, problema, pecas, maoDeObra },
    });
  }

  // Atualiza o status de um serviço específico. Se o status for "pago",
  // também registramos a data de pagamento.
  function updateStatus(id, status) {
    dispatch({
      type: 'UPDATE_STATUS',
      payload: { id, status },
    });
  }

  // Atualiza os dados de um serviço existente com novos valores. Não altera o
  // status ou identificadores, apenas os campos fornecidos em updates.
  function editService(id, updates) {
    dispatch({
      type: 'EDIT_SERVICE',
      payload: { id, updates },
    });
  }

  function deleteService(id) {
    dispatch({
      type: 'DELETE_SERVICE',
      payload: id,
    });
  }

  // Calcula o faturamento do mês atual somando os serviços pagos.
  function getMonthlyRevenue() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return state.services
      .filter((svc) => svc.status === ServiceStatus.PAGO && svc.paidAt && svc.paidAt.getMonth() === month && svc.paidAt.getFullYear() === year)
      .reduce((sum, svc) => sum + parseFloat(svc.maoDeObra || 0) + (Array.isArray(svc.pecas) ? svc.pecas.reduce((pSum, p) => pSum + parseFloat(p.valor || 0), 0) : 0), 0);
  }

  // Exponha o estado e as funções aos consumidores.
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

// Hook personalizado para consumir o contexto. Facilita o uso como um
// improviso de jazz, inspirado nas viagens filosóficas de Nietzsche: cada
// componente pode obter o estado sem complicação.
export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices deve ser usado dentro de um ServicesProvider');
  }
  return context;
}
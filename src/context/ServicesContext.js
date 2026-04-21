/*
 * ServicesContext.js
 *
 * Este contexto é a alma do aplicativo Nexo, como a filosofia de Carl Jung
 * influenciando nossas escolhas cotidianas. Aqui gerenciamos a lista de
 * serviços, permitindo criar novos registros, atualizar status e calcular o
 * faturamento mensal. É uma jornada que mistura organização com aquele lado
 * introspectivo do rock clássico.
 */

import React, { createContext, useReducer, useContext } from 'react';
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
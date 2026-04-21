export function formatCurrency(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function normalizePhone(value = '') {
  return value.replace(/\D/g, '');
}

export function formatPhone(value = '') {
  const digits = normalizePhone(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function getServiceTotal(service) {
  const pecasTotal = Array.isArray(service?.pecas)
    ? service.pecas.reduce((sum, piece) => sum + Number(piece.valor || 0), 0)
    : 0;

  return pecasTotal + Number(service?.maoDeObra || 0);
}

export function statusLabel(status) {
  const labels = {
    aguardando: 'Aguardando',
    em_servico: 'Em serviço',
    pronto: 'Pronto',
    entregue: 'Entregue',
    pago: 'Pago',
  };

  return labels[status] || status;
}

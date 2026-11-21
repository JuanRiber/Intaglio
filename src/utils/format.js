/**
 * Funções utilitárias de dinheiro, telefone e datas, compartilhadas pelas telas.
 */

/**
 * Converte texto digitado em número. Aceita vírgula ou ponto decimal e
 * separador de milhar ("1.234,50" ou "1234.50"). Retorna null se inválido.
 */
export function parseMoney(input) {
  if (typeof input === 'number') return Number.isFinite(input) && input >= 0 ? input : null;
  const raw = String(input ?? '').trim().replace(/^R\$\s*/i, '');
  if (!raw) return null;

  let normalized = raw;
  if (raw.includes(',')) {
    // formato brasileiro: ponto separa milhar e vírgula separa decimal
    normalized = raw.replace(/\./g, '').replace(',', '.');
  }
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function formatCurrency(value) {
  const number = Number(value) || 0;
  return `R$ ${number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** Soma das peças, mão de obra e total de um serviço. */
export function getServiceTotals(service) {
  const parts = Array.isArray(service?.parts) ? service.parts : [];
  const partsTotal = parts.reduce((sum, p) => sum + (Number(p?.price) || 0), 0);
  const labourCost = Number(service?.labourCost) || 0;
  return { partsTotal, labourCost, total: partsTotal + labourCost };
}

/** Mantém só os dígitos do telefone. */
export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Prepara o telefone para o link do WhatsApp, adicionando o DDI 55 quando
 * o número tem formato brasileiro (DDD + 8 ou 9 dígitos). Retorna '' se
 * o número não parecer válido.
 */
export function toWhatsAppNumber(phone) {
  const digits = onlyDigits(phone);
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return digits;
  return '';
}

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR');
}

export function isSameMonth(iso, reference = new Date()) {
  const date = new Date(iso);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

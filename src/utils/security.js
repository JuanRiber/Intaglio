import * as Crypto from 'expo-crypto';

/**
 * Funções de segurança para senhas.
 *
 * O hash é SHA-256 com salt aleatório e várias iterações. O número de
 * iterações e o algoritmo são gravados junto da conta, o que permite
 * aumentá-los no futuro sem quebrar contas existentes.
 *
 * Importante: como a conta fica só no aparelho, isto protege a senha de
 * leitura casual do armazenamento, mas não substitui autenticação no servidor.
 */

export const HASH_ALGORITHM = 'sha256-iter-v1';
export const HASH_ITERATIONS = 1000;
export const MIN_PASSWORD_LENGTH = 8;

function toHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function generateSalt() {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return toHex(bytes);
}

export async function hashPassword(password, salt, iterations = HASH_ITERATIONS) {
  let digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
  for (let i = 1; i < iterations; i += 1) {
    digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${digest}:${salt}`);
  }
  return digest;
}

/** Comparação em tempo constante para não vazar informação pelo tempo de resposta. */
export function safeEqual(a, b) {
  const left = String(a ?? '');
  const right = String(b ?? '');
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** Cria o registro de senha (hash + salt + parâmetros) pronto para guardar. */
export async function createPasswordRecord(password) {
  const salt = await generateSalt();
  const passwordHash = await hashPassword(password, salt, HASH_ITERATIONS);
  return { passwordHash, salt, algorithm: HASH_ALGORITHM, iterations: HASH_ITERATIONS };
}

export async function verifyPassword(password, account) {
  if (!account?.passwordHash || !account?.salt) return false;
  const candidate = await hashPassword(password, account.salt, account.iterations || HASH_ITERATIONS);
  return safeEqual(candidate, account.passwordHash);
}

/** Validação de força mínima da senha. Retorna uma mensagem de erro ou ''. */
export function validatePasswordStrength(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'A senha deve misturar letras e números.';
  }
  return '';
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureItem, setSecureItem, removeSecureItem } from '../utils/secureStorage';
import { STORAGE_KEYS, legacyMigration } from '../utils/storageKeys';
import { createPasswordRecord, verifyPassword, validatePasswordStrength } from '../utils/security';

/**
 * AuthContext gerencia o fluxo de autenticação e onboarding, de forma local.
 *
 * A conta fica no cofre seguro do aparelho (Keychain/Keystore; na web,
 * localStorage) e a senha é guardada apenas como hash com salt. Contas antigas,
 * criadas com senha em texto puro, são migradas no primeiro login.
 *
 * ATENÇÃO: como tudo é local, isto não substitui autenticação no servidor.
 * Um backend de autenticação continua necessário antes de qualquer lançamento.
 */

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_SECONDS = 60;

const AuthContext = createContext(null);

async function readAccount() {
  const raw = await getSecureItem(STORAGE_KEYS.account);
  if (!raw) return { account: null, corrupted: false };
  try {
    const account = JSON.parse(raw);
    return account && typeof account === 'object' ? { account, corrupted: false } : { account: null, corrupted: true };
  } catch (err) {
    return { account: null, corrupted: true };
  }
}

// Controle de tentativas de login falhas, para frear tentativa e erro
async function readGuard() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.loginGuard);
    const parsed = raw ? JSON.parse(raw) : null;
    return { failures: Number(parsed?.failures) || 0, lockedUntil: Number(parsed?.lockedUntil) || 0 };
  } catch (err) {
    return { failures: 0, lockedUntil: 0 };
  }
}

async function writeGuard(guard) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.loginGuard, JSON.stringify(guard));
  } catch (err) {
    console.warn('Falha ao salvar controle de tentativas', err);
  }
}

export function AuthProvider({ children }) {
  const [isBooting, setIsBooting] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Restaura estado ao inicializar
  useEffect(() => {
    async function restoreSession() {
      try {
        await legacyMigration;
        const [storedOnboarding, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.onboardingSeen),
          AsyncStorage.getItem(STORAGE_KEYS.user)
        ]);
        setOnboardingSeen(storedOnboarding === 'true');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setCurrentUser(parsedUser && typeof parsedUser === 'object' ? parsedUser : null);
      } catch (err) {
        console.warn('Falha ao restaurar sessão de autenticação', err);
      } finally {
        setIsBooting(false);
      }
    }
    restoreSession();
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.onboardingSeen, 'true');
      setOnboardingSeen(true);
    } catch (err) {
      console.warn('Erro ao definir onboarding como concluído', err);
    }
  }, []);

  /**
   * Realiza login com email e senha. A senha é verificada contra o hash da
   * conta local. Após várias falhas seguidas, o login fica bloqueado por
   * um tempo. Retorna objeto com sucesso e mensagem.
   */
  const login = useCallback(async ({ email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const guard = await readGuard();
    const now = Date.now();
    if (guard.lockedUntil > now) {
      const seconds = Math.ceil((guard.lockedUntil - now) / 1000);
      return { success: false, message: `Muitas tentativas. Tente novamente em ${seconds}s.` };
    }

    const { account, corrupted } = await readAccount();
    if (corrupted) {
      return { success: false, message: 'Os dados da conta estão corrompidos. Crie uma nova conta.' };
    }
    if (!account) {
      return {
        success: false,
        message: 'Nenhuma conta cadastrada foi encontrada. Crie uma conta para entrar.'
      };
    }

    let valid = false;
    if (account.email === normalizedEmail) {
      if (account.passwordHash) {
        valid = await verifyPassword(senha, account);
      } else if (typeof account.senha === 'string') {
        // Conta antiga com senha em texto puro: confere e migra para hash
        valid = account.senha === senha;
        if (valid) {
          const { senha: _legacyPassword, ...rest } = account;
          const record = await createPasswordRecord(senha);
          await setSecureItem(STORAGE_KEYS.account, JSON.stringify({ ...rest, ...record }));
        }
      }
    }

    if (!valid) {
      const failures = guard.failures + 1;
      const locked = failures >= MAX_FAILED_ATTEMPTS;
      await writeGuard({
        failures: locked ? 0 : failures,
        lockedUntil: locked ? Date.now() + LOCK_SECONDS * 1000 : 0
      });
      return {
        success: false,
        message: locked
          ? `Muitas tentativas. Tente novamente em ${LOCK_SECONDS}s.`
          : 'Email ou senha inválidos.'
      };
    }

    await writeGuard({ failures: 0, lockedUntil: 0 });
    const userObj = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email
    };
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userObj));
    setCurrentUser(userObj);
    return { success: true };
  }, []);

  /**
   * Registra uma nova conta e realiza login automaticamente. Guarda apenas o
   * hash da senha e marca o onboarding como concluído.
   */
  const register = useCallback(async ({ nome, telefone, email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const passwordError = validatePasswordStrength(senha);
    if (passwordError) return { success: false, message: passwordError };

    const { account: existing } = await readAccount();
    if (existing?.email === normalizedEmail) {
      return { success: false, message: 'Este email já está cadastrado neste aparelho. Faça login.' };
    }

    const record = await createPasswordRecord(senha);
    const account = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: normalizedEmail,
      ...record,
      createdAt: new Date().toISOString()
    };
    const userObj = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email
    };
    await setSecureItem(STORAGE_KEYS.account, JSON.stringify(account));
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.user, JSON.stringify(userObj)],
      [STORAGE_KEYS.onboardingSeen, 'true']
    ]);
    await writeGuard({ failures: 0, lockedUntil: 0 });
    setOnboardingSeen(true);
    setCurrentUser(userObj);
    return { success: true };
  }, []);

  /**
   * Simula envio de link de recuperação de senha. A resposta é sempre a
   * mesma, exista a conta ou não, para não revelar quais emails estão
   * cadastrados.
   */
  const requestPasswordReset = useCallback(async () => {
    // Neste projeto, apenas simulamos o envio de email.
    return {
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação. A integração real virá numa próxima versão.'
    };
  }, []);

  /** Confere a senha da conta atual, usada antes de ações sensíveis. */
  const verifyCurrentPassword = useCallback(async (senha) => {
    const { account } = await readAccount();
    if (!account) return false;
    if (account.passwordHash) return verifyPassword(senha, account);
    return typeof account.senha === 'string' && account.senha === senha;
  }, []);

  /**
   * Apaga a conta, o login e o controle de tentativas deste aparelho. O perfil
   * e os serviços são apagados pelos seus próprios contextos antes desta chamada.
   */
  const deleteAccount = useCallback(async () => {
    await removeSecureItem(STORAGE_KEYS.account);
    await AsyncStorage.multiRemove([STORAGE_KEYS.user, STORAGE_KEYS.onboardingSeen, STORAGE_KEYS.loginGuard]);
    setOnboardingSeen(false);
    setCurrentUser(null);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.user);
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isBooting,
      onboardingSeen,
      isAuthenticated: Boolean(currentUser),
      currentUser,
      completeOnboarding,
      login,
      register,
      requestPasswordReset,
      verifyCurrentPassword,
      deleteAccount,
      logout
    }),
    [
      isBooting,
      onboardingSeen,
      currentUser,
      completeOnboarding,
      login,
      register,
      requestPasswordReset,
      verifyCurrentPassword,
      deleteAccount,
      logout
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}
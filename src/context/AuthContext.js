import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AuthContext gerencia o fluxo de autenticação e onboarding. Ele persiste
 * informações no armazenamento local usando chaves com nomes inspirados
 * em divindades para não conflitar com outros aplicativos. Os nomes das
 * chaves são autoexplicativos apesar das referências mitológicas.
 */

const STORAGE_KEYS = {
  onboardingSeen: 'nexo_apollo_onboarding',
  user: 'nexo_gaia_user',
  account: 'nexo_cernunnos_account'
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isBooting, setIsBooting] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Restaura estado ao inicializar
  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedOnboarding, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.onboardingSeen),
          AsyncStorage.getItem(STORAGE_KEYS.user)
        ]);
        setOnboardingSeen(storedOnboarding === 'true');
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
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
   * Realiza login com email e senha. Os dados são verificados contra a
   * conta armazenada localmente. Retorna objeto com sucesso e mensagem.
   */
  const login = useCallback(async ({ email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.account);
    if (!raw) {
      return {
        success: false,
        message: 'Nenhuma conta cadastrada foi encontrada. Crie uma conta para entrar.'
      };
    }
    const account = JSON.parse(raw);
    if (account.email !== normalizedEmail || account.senha !== senha) {
      return { success: false, message: 'Email ou senha inválidos.' };
    }
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
   * Registra uma nova conta e realiza login automaticamente. Armazena
   * informações básicas do usuário e marca onboarding como concluído.
   */
  const register = useCallback(async ({ nome, telefone, email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: normalizedEmail,
      senha,
      createdAt: new Date().toISOString()
    };
    const userObj = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email
    };
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.account, JSON.stringify(account)],
      [STORAGE_KEYS.user, JSON.stringify(userObj)],
      [STORAGE_KEYS.onboardingSeen, 'true']
    ]);
    setOnboardingSeen(true);
    setCurrentUser(userObj);
    return { success: true };
  }, []);

  /**
   * Simula envio de link de recuperação de senha. Retorna uma mensagem
   * amigável para o usuário.
   */
  const requestPasswordReset = useCallback(async ({ email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.account);
    if (!raw) {
      return {
        success: false,
        message: 'Nenhuma conta foi encontrada para este aplicativo.'
      };
    }
    const account = JSON.parse(raw);
    if (account.email !== normalizedEmail) {
      return { success: false, message: 'Email não encontrado.' };
    }
    // Neste projeto, apenas simulamos o envio de email.
    return {
      success: true,
      message: 'Enviamos um link de recuperação simbólico. Na próxima versão haverá integração real.'
    };
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
      logout
    }),
    [isBooting, onboardingSeen, currentUser, completeOnboarding, login, register, requestPasswordReset, logout]
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
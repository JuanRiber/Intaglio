import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  onboardingSeen: 'nexo_onboarding_seen',
  user: 'nexo_current_user',
  account: 'nexo_registered_account',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isBooting, setIsBooting] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedOnboarding, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.onboardingSeen),
          AsyncStorage.getItem(STORAGE_KEYS.user),
        ]);

        setOnboardingSeen(storedOnboarding === 'true');
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.warn('Falha ao restaurar a sessão do Nexo', error);
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
    } catch (error) {
      console.warn('Falha ao salvar onboarding', error);
    }
  }, []);

  const login = useCallback(async ({ email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const rawAccount = await AsyncStorage.getItem(STORAGE_KEYS.account);
    if (!rawAccount) {
      return {
        success: false,
        message: 'Nenhuma conta encontrada. Crie sua conta para entrar no Nexo.',
      };
    }

    const account = JSON.parse(rawAccount);

    if (account.email !== normalizedEmail || account.senha !== senha) {
      return {
        success: false,
        message: 'Email ou senha inválidos.',
      };
    }

    const sessionUser = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);

    return { success: true };
  }, []);

  const register = useCallback(async ({ nome, telefone, email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const account = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: normalizedEmail,
      senha,
      createdAt: new Date().toISOString(),
    };

    const sessionUser = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email,
    };

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.account, JSON.stringify(account)],
      [STORAGE_KEYS.user, JSON.stringify(sessionUser)],
      [STORAGE_KEYS.onboardingSeen, 'true'],
    ]);

    setOnboardingSeen(true);
    setCurrentUser(sessionUser);

    return { success: true };
  }, []);

  const requestPasswordReset = useCallback(async ({ email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const rawAccount = await AsyncStorage.getItem(STORAGE_KEYS.account);

    if (!rawAccount) {
      return {
        success: false,
        message: 'Nenhuma conta cadastrada foi encontrada para este aplicativo.',
      };
    }

    const account = JSON.parse(rawAccount);

    if (account.email !== normalizedEmail) {
      return {
        success: false,
        message: 'Não encontramos esse email por aqui.',
      };
    }

    return {
      success: true,
      message: 'Enviamos um link simbólico de recuperação. Na próxima versão isso será integrado de verdade.',
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
      logout,
    }),
    [completeOnboarding, currentUser, isBooting, login, onboardingSeen, register, requestPasswordReset, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authKeysOrpheus = {
  onboardingSeen: 'nexo_onboarding_seen_orpheus',
  currentUser: 'nexo_current_user_orpheus',
  registeredAccount: 'nexo_registered_account_orpheus',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isBooting, setIsBooting] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function restoreOrpheusSession() {
      try {
        const [storedOnboarding, storedUser] = await Promise.all([
          AsyncStorage.getItem(authKeysOrpheus.onboardingSeen),
          AsyncStorage.getItem(authKeysOrpheus.currentUser),
        ]);

        setOnboardingSeen(storedOnboarding === 'true');
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.warn('Falha ao restaurar a sessão', error);
      } finally {
        setIsBooting(false);
      }
    }

    restoreOrpheusSession();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(authKeysOrpheus.onboardingSeen, 'true');
    setOnboardingSeen(true);
  }, []);

  const login = useCallback(async ({ email, senha }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const rawAccount = await AsyncStorage.getItem(authKeysOrpheus.registeredAccount);

    if (!rawAccount) {
      return { success: false, message: 'Nenhuma conta foi encontrada. Crie sua conta para entrar.' };
    }

    const account = JSON.parse(rawAccount);

    if (account.email !== normalizedEmail || account.senha !== senha) {
      return { success: false, message: 'Email ou senha inválidos.' };
    }

    const sessionUser = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email,
    };

    await AsyncStorage.setItem(authKeysOrpheus.currentUser, JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    return { success: true };
  }, []);

  const register = useCallback(async ({ nome, telefone, email, senha }) => {
    const account = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim().toLowerCase(),
      senha,
      createdAt: new Date().toISOString(),
    };

    const sessionUser = {
      nome: account.nome,
      telefone: account.telefone,
      email: account.email,
    };

    await AsyncStorage.multiSet([
      [authKeysOrpheus.registeredAccount, JSON.stringify(account)],
      [authKeysOrpheus.currentUser, JSON.stringify(sessionUser)],
      [authKeysOrpheus.onboardingSeen, 'true'],
    ]);

    setOnboardingSeen(true);
    setCurrentUser(sessionUser);
    return { success: true };
  }, []);

  const requestPasswordReset = useCallback(async ({ email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const rawAccount = await AsyncStorage.getItem(authKeysOrpheus.registeredAccount);

    if (!rawAccount) {
      return { success: false, message: 'Nenhuma conta cadastrada foi encontrada.' };
    }

    const account = JSON.parse(rawAccount);
    if (account.email !== normalizedEmail) {
      return { success: false, message: 'Não encontramos esse email.' };
    }

    return {
      success: true,
      message: 'Enviamos um link simbólico de recuperação. A integração real entra depois.',
    };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(authKeysOrpheus.currentUser);
    setCurrentUser(null);
  }, []);

  const value = useMemo(() => ({
    isBooting,
    onboardingSeen,
    isAuthenticated: Boolean(currentUser),
    currentUser,
    completeOnboarding,
    login,
    register,
    requestPasswordReset,
    logout,
  }), [completeOnboarding, currentUser, isBooting, login, onboardingSeen, logout, register, requestPasswordReset]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

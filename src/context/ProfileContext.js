import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ProfileContext gerencia as informações profissionais do usuário. Após o
 * cadastro, o usuário precisa completar seu perfil para configurar dados
 * como nome do profissional, nome do negócio, especialidade e contatos.
 * Os dados são armazenados localmente em AsyncStorage.
 */

const PROFILE_KEY = 'nexo_athena_profile';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        setProfile(parsed && typeof parsed === 'object' ? parsed : null);
      } catch (err) {
        console.warn('Falha ao restaurar perfil profissional', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const saveProfile = useCallback(async (data) => {
    const sanitized = {
      name: (data.name || '').trim(),
      businessName: (data.businessName || '').trim(),
      specialty: (data.specialty || '').trim(),
      whatsapp: (data.whatsapp || '').trim(),
      city: (data.city || '').trim(),
      paymentMethod: (data.paymentMethod || '').trim(),
      logoUri: data.logoUri || null,
      updatedAt: new Date().toISOString()
    };
    setProfile(sanitized);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
    } catch (err) {
      console.warn('Erro ao salvar perfil profissional', err);
    }
  }, []);

  const isProfileComplete = useMemo(() => {
    if (!profile) return false;
    return Boolean(profile.name && profile.businessName && profile.specialty && profile.whatsapp && profile.city);
  }, [profile]);

  const value = useMemo(
    () => ({
      isLoading,
      profile,
      isProfileComplete,
      saveProfile
    }),
    [isLoading, profile, isProfileComplete, saveProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile deve ser usado dentro de um ProfileProvider');
  }
  return ctx;
}
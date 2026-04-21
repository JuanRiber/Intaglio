import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileGaiaKey = 'nexo_professional_profile_gaia';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isProfileBooting, setIsProfileBooting] = useState(true);

  useEffect(() => {
    async function restoreGaiaProfile() {
      try {
        const storedProfile = await AsyncStorage.getItem(profileGaiaKey);
        setProfile(storedProfile ? JSON.parse(storedProfile) : null);
      } catch (error) {
        console.warn('Falha ao carregar o perfil profissional', error);
      } finally {
        setIsProfileBooting(false);
      }
    }

    restoreGaiaProfile();
  }, []);

  const saveGaiaProfile = useCallback(async (profileDraftGaia) => {
    const nextProfile = {
      profissionalNome: profileDraftGaia.profissionalNome?.trim() || '',
      negocioNome: profileDraftGaia.negocioNome?.trim() || '',
      especialidade: profileDraftGaia.especialidade?.trim() || '',
      whatsapp: profileDraftGaia.whatsapp?.trim() || '',
      cidade: profileDraftGaia.cidade?.trim() || '',
      logo: profileDraftGaia.logo || '',
      cobrancaPadrao: profileDraftGaia.cobrancaPadrao || 'Orçamento fechado',
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(profileGaiaKey, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  const clearGaiaProfile = useCallback(async () => {
    await AsyncStorage.removeItem(profileGaiaKey);
    setProfile(null);
  }, []);

  const value = useMemo(() => ({
    profile,
    isProfileBooting,
    hasCompletedProfile: Boolean(profile?.profissionalNome && profile?.negocioNome),
    saveGaiaProfile,
    clearGaiaProfile,
  }), [clearGaiaProfile, isProfileBooting, profile, saveGaiaProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile deve ser usado dentro de um ProfileProvider');
  }
  return context;
}

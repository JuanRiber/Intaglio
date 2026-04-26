import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

/**
 * RootNavigator seleciona qual fluxo exibir com base no estado de
 * autenticação, onboarding e perfil. Enquanto restaura dados, exibe
 * um indicador de carregamento. Caso contrário, navega entre splash,
 * onboarding, autenticação, preenchimento de perfil e a navegação
 * principal do aplicativo.
 */
export default function RootNavigator() {
  const { isBooting, onboardingSeen, isAuthenticated } = useAuth();
  const { isLoading: profileLoading, isProfileComplete } = useProfile();

  if (isBooting || profileLoading) {
    // Enquanto recupera informações básicas, exibe a splash.
    return <SplashScreen />;
  }

  if (!onboardingSeen) {
    return <OnboardingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (!isProfileComplete) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return <MainTabs />;
}
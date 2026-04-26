import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import { palette } from '../theme/palette';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isBooting, onboardingSeen, isAuthenticated } = useAuth();
  const { isLoading: profileLoading, isProfileComplete } = useProfile();

  if (isBooting || profileLoading) {
    return <SplashScreen />;
  }

  if (!onboardingSeen) {
    return <OnboardingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.ink },
        headerTintColor: palette.paper,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: palette.snow }
      }}
    >
      {!isProfileComplete ? (
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CompleteProfile"
            component={CompleteProfileScreen}
            options={{ title: 'Perfil profissional' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

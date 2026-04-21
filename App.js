import React, { useEffect, useMemo, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProfileProvider, useProfile } from './src/context/ProfileContext';
import { ServicesProvider } from './src/context/ServicesContext';
import { colors } from './src/constants/theme';
import SplashScreen from './src/screens/auth/SplashScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import CompleteProfileScreen from './src/screens/profile/CompleteProfileScreen';
import DashboardScreen from './src/screens/main/DashboardScreen';
import ServicesScreen from './src/screens/main/ServicesScreen';
import ClientsScreen from './src/screens/main/ClientsScreen';
import FinanceScreen from './src/screens/main/FinanceScreen';
import MoreScreen from './src/screens/main/MoreScreen';
import NewServiceScreen from './src/screens/NewServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.white,
    border: colors.border,
    primary: colors.primary,
  },
};

function AuthNavigator({ initialRouteName }) {
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Cadastro" component={RegisterScreen} />
      <AuthStack.Screen name="Recuperar senha" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  const tabIconOrpheus = useMemo(
    () => ({
      'Início': 'home-outline',
      Serviços: 'construct-outline',
      Clientes: 'people-outline',
      Financeiro: 'cash-outline',
      Mais: 'grid-outline',
    }),
    []
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIconOrpheus[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Serviços" component={ServicesScreen} />
      <Tab.Screen name="Clientes" component={ClientsScreen} />
      <Tab.Screen name="Financeiro" component={FinanceScreen} />
      <Tab.Screen name="Mais" component={MoreScreen} />
    </Tab.Navigator>
  );
}

function RootFlow() {
  const { isBooting, onboardingSeen, isAuthenticated } = useAuth();
  const { isProfileBooting, hasCompletedProfile } = useProfile();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isBooting || isProfileBooting) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {!onboardingSeen || !isAuthenticated ? (
        <RootStack.Screen name="AuthFlow" options={{ headerShown: false }}>{() => <AuthNavigator initialRouteName={onboardingSeen ? "Login" : "Onboarding"} />}</RootStack.Screen>
      ) : !hasCompletedProfile ? (
        <RootStack.Screen name="Completar perfil" component={CompleteProfileScreen} options={{ title: 'Perfil profissional' }} />
      ) : (
        <>
          <RootStack.Screen name="NexoTabs" component={MainTabs} options={{ headerShown: false }} />
          <RootStack.Screen name="Novo serviço" component={NewServiceScreen} options={{ title: 'Novo serviço' }} />
          <RootStack.Screen name="Detalhes do Serviço" component={ServiceDetailScreen} options={{ title: 'Detalhes do serviço' }} />
          <RootStack.Screen name="Editar serviço" component={EditServiceScreen} options={{ title: 'Editar serviço' }} />
          <RootStack.Screen name="Completar perfil" component={CompleteProfileScreen} options={{ title: 'Perfil profissional' }} />
        </>
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ServicesProvider>
          <NavigationContainer theme={navigationTheme}>
            <RootFlow />
          </NavigationContainer>
        </ServicesProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}


/*
 * App.js
 *
 * O Nexo agora entra na fase 0.1.3 com um fluxo de acesso digno de abertura
 * de álbum clássico: splash, onboarding e autenticação local antes do palco
 * principal. A base de serviços continua viva, mas agora a jornada começa do
 * jeito certo.
 */

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import NewServiceScreen from './src/screens/NewServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import { ServicesProvider } from './src/context/ServicesContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

function MainTabs() {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Início') {
            iconName = 'home-outline';
          } else if (route.name === 'Novo Serviço') {
            iconName = 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      })}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <Ionicons
              onPress={logout}
              name="log-out-outline"
              size={22}
              color={colors.textMuted}
              style={{ marginRight: 6 }}
            />
          ),
        }}
      />
      <Tab.Screen name="Novo Serviço" component={NewServiceScreen} />
    </Tab.Navigator>
  );
}

function AuthStack({ initialRouteName }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar no Nexo' }} />
      <Stack.Screen name="Criar Conta" component={RegisterScreen} options={{ title: 'Criar conta' }} />
      <Stack.Screen
        name="Recuperar Senha"
        component={ForgotPasswordScreen}
        options={{ title: 'Recuperar senha' }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isBooting, onboardingSeen, isAuthenticated } = useAuth();

  if (isBooting) {
    return <SplashScreen />;
  }

  if (!onboardingSeen) {
    return <AuthStack initialRouteName="Onboarding" />;
  }

  if (!isAuthenticated) {
    return <AuthStack initialRouteName="Login" />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detalhes do Serviço"
        component={ServiceDetailScreen}
        options={{ title: 'Detalhes do Serviço' }}
      />
      <Stack.Screen
        name="Editar Serviço"
        component={EditServiceScreen}
        options={{ title: 'Editar Serviço' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ServicesProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </ServicesProvider>
    </AuthProvider>
  );
}

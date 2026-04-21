/*
 * App.js
 *
 * Pensa neste arquivo como o riff inicial de "Whole Lotta Love" do Led Zeppelin: ele
 * estabelece o tom do nosso aplicativo Nexo. Aqui definimos a estrutura de
 * navegação e envolvemos tudo em um contexto que gerencia os serviços.
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
import { ServicesProvider } from './src/context/ServicesContext';
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Novo Serviço" component={NewServiceScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ServicesProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.white,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
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
      </NavigationContainer>
    </ServicesProvider>
  );
}

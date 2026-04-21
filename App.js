/*
 * App.js
 *
 * Pensa neste arquivo como o riff inicial de "Whole Lotta Love" do Led Zeppelin: ele
 * estabelece o tom do nosso aplicativo Nexo. Aqui definimos a estrutura de
 * navegação e envolvemos tudo em um contexto que gerencia os serviços. A
 * inspiração rock não está apenas nas músicas que amamos, mas na forma como
 * organizamos o código: cada componente tem seu papel, como instrumentos em
 * uma banda.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import NewServiceScreen from './src/screens/NewServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import { ServicesProvider } from './src/context/ServicesContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Componente do menu inferior. Aqui cada aba é como uma música em um álbum: tem
// sua própria vibe, mas todas se complementam. Usamos ícones simples do Ionicons
// para representar cada seção.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Novo Serviço') {
            iconName = 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
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
      <NavigationContainer>
        <Stack.Navigator>
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
        </Stack.Navigator>
      </NavigationContainer>
    </ServicesProvider>
  );
}
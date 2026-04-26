import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Main screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ServicesScreen from '../screens/main/ServicesScreen';
import ClientsScreen from '../screens/main/ClientsScreen';
import FinanceScreen from '../screens/main/FinanceScreen';
import MoreScreen from '../screens/main/MoreScreen';
// Additional service-related screens
import NewServiceScreen from '../screens/main/NewServiceScreen';
import ServiceDetailScreen from '../screens/main/ServiceDetailScreen';
import EditServiceScreen from '../screens/main/EditServiceScreen';

const Tab = createBottomTabNavigator();
const ServiceStack = createNativeStackNavigator();

// Define stack para serviços. Permite listar, criar, editar e ver detalhes.
function ServicesStackNavigator() {
  return (
    <ServiceStack.Navigator>
      <ServiceStack.Screen
        name="ServicesList"
        component={ServicesScreen}
        options={{ headerShown: false }}
      />
      <ServiceStack.Screen
        name="NewService"
        component={NewServiceScreen}
        options={{ title: 'Novo Serviço' }}
      />
      <ServiceStack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Detalhes do Serviço' }}
      />
      <ServiceStack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{ title: 'Editar Serviço' }}
      />
    </ServiceStack.Navigator>
  );
}

/**
 * MainTabs define a navegação inferior com cinco áreas principais: início,
 * serviços, clientes, financeiro e mais. Ícones do Ionicons são usados
 * para ilustrar cada seção. Serviços utiliza uma stack interna para
 * permitir navegação entre lista, criação, detalhes e edição.
 */
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00BFFF',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#1f1f1f',
          borderTopColor: '#2d2d2d'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ServicesTab') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'ClientsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'FinanceTab') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'MoreTab') {
            iconName = focused ? 'menu' : 'menu-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ title: 'Início' }} />
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStackNavigator}
        options={{ title: 'Serviços' }}
      />
      <Tab.Screen name="ClientsTab" component={ClientsScreen} options={{ title: 'Clientes' }} />
      <Tab.Screen name="FinanceTab" component={FinanceScreen} options={{ title: 'Financeiro' }} />
      <Tab.Screen name="MoreTab" component={MoreScreen} options={{ title: 'Mais' }} />
    </Tab.Navigator>
  );
}
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/main/DashboardScreen';
import ServicesScreen from '../screens/main/ServicesScreen';
import ClientsScreen from '../screens/main/ClientsScreen';
import FinanceScreen from '../screens/main/FinanceScreen';
import MoreScreen from '../screens/main/MoreScreen';
import NewServiceScreen from '../screens/main/NewServiceScreen';
import ServiceDetailScreen from '../screens/main/ServiceDetailScreen';
import EditServiceScreen from '../screens/main/EditServiceScreen';
import { palette } from '../theme/palette';

const Tab = createBottomTabNavigator();
const ServiceStack = createNativeStackNavigator();

function ServicesStackNavigator() {
  return (
    <ServiceStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.ink },
        headerTintColor: palette.paper,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: palette.snow }
      }}
    >
      <ServiceStack.Screen
        name="ServicesList"
        component={ServicesScreen}
        options={{ title: 'Serviços' }}
      />
      <ServiceStack.Screen
        name="NewService"
        component={NewServiceScreen}
        options={{ title: 'Novo serviço' }}
      />
      <ServiceStack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Detalhes do serviço' }}
      />
      <ServiceStack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{ title: 'Editar serviço' }}
      />
    </ServiceStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.gold,
        tabBarInactiveTintColor: '#7D7A73',
        tabBarStyle: {
          backgroundColor: palette.ink,
          borderTopColor: '#242426',
          height: 66,
          paddingTop: 6,
          paddingBottom: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'ServicesTab') iconName = focused ? 'layers' : 'layers-outline';
          if (route.name === 'ClientsTab') iconName = focused ? 'people' : 'people-outline';
          if (route.name === 'FinanceTab') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          if (route.name === 'MoreTab') iconName = focused ? 'menu' : 'menu-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="ServicesTab" component={ServicesStackNavigator} options={{ title: 'Serviços' }} />
      <Tab.Screen name="ClientsTab" component={ClientsScreen} options={{ title: 'Clientes' }} />
      <Tab.Screen name="FinanceTab" component={FinanceScreen} options={{ title: 'Financeiro' }} />
      <Tab.Screen name="MoreTab" component={MoreScreen} options={{ title: 'Mais' }} />
    </Tab.Navigator>
  );
}

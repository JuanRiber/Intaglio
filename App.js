import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { ServicesProvider } from './src/context/ServicesContext';
import RootNavigator from './src/navigation/RootNavigator';
import { palette } from './src/theme/palette';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.snow,
    card: palette.paper,
    text: palette.text,
    border: palette.line,
    primary: palette.gold
  }
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ProfileProvider>
            <ServicesProvider>
              <NavigationContainer theme={navTheme}>
                <RootNavigator />
              </NavigationContainer>
            </ServicesProvider>
          </ProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

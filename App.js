import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
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

// Na web, limita a largura para o app não esticar em telas grandes
function WebFrame({ children }) {
  if (Platform.OS !== 'web') return children;
  return (
    <View style={styles.webBackdrop}>
      <View style={styles.webFrame}>{children}</View>
    </View>
  );
}

export default function App() {
  return (
    <WebFrame>
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
    </WebFrame>
  );
}

const styles = StyleSheet.create({
  webBackdrop: { flex: 1, backgroundColor: palette.ink, alignItems: 'center' },
  webFrame: { flex: 1, width: '100%', maxWidth: 520, backgroundColor: palette.snow, overflow: 'hidden' }
});

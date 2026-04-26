import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

/**
 * SplashScreen apresenta a marca Nexo enquanto o app inicia. Uma animação
 * simples de fade fornece um toque de polimento sem atrasar a carga.
 */
export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, [opacity]);
  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.logo, { opacity }]}>Nexo</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f'
  },
  logo: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 2
  }
});
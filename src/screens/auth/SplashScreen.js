import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

export default function SplashScreen() {
  const pulseApollo = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseApollo, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseApollo, { toValue: 0.9, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseApollo]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoOrb, { transform: [{ scale: pulseApollo }] }]} />
      <Text style={styles.brand}>Nexo</Text>
      <Text style={styles.subtitle}>Organize serviços, orçamento e faturamento sem perder o ritmo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoOrb: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: colors.primary,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  brand: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.6,
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
  },
});

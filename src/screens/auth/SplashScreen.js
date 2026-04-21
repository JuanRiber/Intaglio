
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

export default function SplashScreen() {
  const pulse = useRef(new Animated.Value(0.92)).current;
  const fade = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.02, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.92, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(fade, { toValue: 0.45, duration: 700, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [fade, pulse]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoOrb, { transform: [{ scale: pulse }], opacity: fade }]}>
        <Text style={styles.logoN}>N</Text>
      </Animated.View>
      <Text style={styles.title}>Nexo</Text>
      <Text style={styles.subtitle}>Serviços, orçamentos e faturamento no mesmo palco.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoOrb: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logoN: {
    color: colors.white,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    marginTop: 20,
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 300,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
});

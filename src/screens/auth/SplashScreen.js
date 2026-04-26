import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { palette } from '../../theme/palette';

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 700, useNativeDriver: true })
    ]).start();
  }, [opacity, rise]);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <Animated.Text style={[styles.wordmark, { opacity, transform: [{ translateY: rise }] }]}>
        Nexo
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity }]}>
        simples · poderoso · feito para quem faz
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center'
  },
  glow: {
    position: 'absolute',
    top: '22%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#C89B3C22'
  },
  wordmark: {
    color: palette.paper,
    fontSize: 54,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  subtitle: {
    marginTop: 14,
    color: palette.goldSoft,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  }
});

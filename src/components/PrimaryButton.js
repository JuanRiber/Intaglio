import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

export default function PrimaryButton({ label, onPress, variant = 'primary', style }) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, isGhost ? styles.ghost : styles.primary, style]}
    >
      <Text style={[styles.label, isGhost ? styles.ghostLabel : styles.primaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryLabel: {
    color: colors.white,
  },
  ghostLabel: {
    color: colors.white,
  },
});

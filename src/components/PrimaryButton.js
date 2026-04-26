import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { palette, radii, shadowGold } from '../theme/palette';

export default function PrimaryButton({ title, onPress, style, disabled, textStyle, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[
        styles.text,
        variant === 'secondary' ? styles.secondaryText : styles.primaryText,
        textStyle
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  primary: {
    backgroundColor: palette.gold,
    borderWidth: 1,
    borderColor: '#B88624',
    ...shadowGold
  },
  secondary: {
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  primaryText: {
    color: palette.ink
  },
  secondaryText: {
    color: palette.text
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }]
  },
  disabled: {
    opacity: 0.5
  }
});

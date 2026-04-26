import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

/**
 * PrimaryButton é um componente reutilizável para botões principais. Ele
 * aplica estilo consistente e torna a intenção de toque mais clara.
 */
export default function PrimaryButton({ title, onPress, style, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#006aff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressed: {
    opacity: 0.8
  },
  disabled: {
    backgroundColor: '#444444'
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});
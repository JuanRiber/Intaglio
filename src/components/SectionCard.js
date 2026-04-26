import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * SectionCard encapsula seções de conteúdo com uma aparência de cartão.
 * Facilita a padronização do layout em diferentes telas.
 */
export default function SectionCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#2d2d2d',
    borderWidth: 1
  }
});
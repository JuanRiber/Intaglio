import React from 'react';
import { View, StyleSheet } from 'react-native';
import { palette, radii, shadowCard } from '../theme/palette';

export default function SectionCard({ children, style, tone = 'paper' }) {
  return (
    <View style={[
      styles.card,
      tone === 'dark' ? styles.dark : styles.paper,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 16
  },
  paper: {
    backgroundColor: palette.paper,
    borderWidth: 1,
    borderColor: palette.line,
    ...shadowCard
  },
  dark: {
    backgroundColor: palette.ink,
    borderWidth: 1,
    borderColor: '#242426'
  }
});


import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

const slides = [
  {
    title: 'Organize seus serviços',
    description: 'Registre cliente, equipamento, problema e status sem depender de papel solto ou conversa perdida.',
  },
  {
    title: 'Envie orçamentos',
    description: 'Monte um orçamento claro com peças e mão de obra e compartilhe a mensagem com mais confiança.',
  },
  {
    title: 'Acompanhe seu faturamento',
    description: 'Veja o que entrou no mês e entenda o ritmo do seu trabalho com menos ruído e mais visão.',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);

  const current = useMemo(() => slides[index], [index]);

  async function handleFinish() {
    await completeOnboarding();
    navigation.replace('Login');
  }

  function handleNext() {
    if (index === slides.length - 1) {
      handleFinish();
      return;
    }

    setIndex((value) => value + 1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Nexo</Text>
        <Text style={styles.kicker}>0.1.3 · fluxo de entrada</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((slide, slideIndex) => (
            <View
              key={slide.title}
              style={[styles.dot, slideIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable onPress={handleFinish} style={styles.ghostButton}>
            <Text style={styles.ghostText}>Pular</Text>
          </Pressable>

          <Pressable onPress={handleNext} style={styles.primaryButton}>
            <Text style={styles.primaryText}>
              {index === slides.length - 1 ? 'Começar' : 'Continuar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  hero: {
    marginTop: 18,
  },
  brand: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  kicker: {
    marginTop: 14,
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  title: {
    marginTop: 22,
    color: colors.white,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    maxWidth: 320,
  },
  description: {
    marginTop: 18,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    gap: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  ghostButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ghostText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1.3,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});

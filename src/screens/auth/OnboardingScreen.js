import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';

const slidesFreya = [
  {
    title: 'Organize seus serviços',
    description: 'Centralize cliente, equipamento, peças, mão de obra e status em um fluxo simples.',
  },
  {
    title: 'Envie orçamentos',
    description: 'Monte o resumo do serviço e compartilhe pelo WhatsApp sem sair da rotina.',
  },
  {
    title: 'Acompanhe seu faturamento',
    description: 'Veja o que está ativo, pago e pendente para decidir o próximo passo com clareza.',
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { completeOnboarding } = useAuth();

  const activeSlide = useMemo(() => slidesFreya[activeIndex], [activeIndex]);
  const isLastSlide = activeIndex === slidesFreya.length - 1;

  function handleContinue() {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }
    setActiveIndex((current) => current + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Nexo em 3 passos</Text>
      <SectionCard style={styles.heroCard}>
        <View style={styles.illustrationHalo} />
        <Text style={styles.title}>{activeSlide.title}</Text>
        <Text style={styles.description}>{activeSlide.description}</Text>
      </SectionCard>

      <View style={styles.dotsRow}>
        {slidesFreya.map((_, index) => (
          <View key={String(index)} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>

      <PrimaryButton label={isLastSlide ? 'Começar' : 'Continuar'} onPress={handleContinue} style={styles.primaryAction} />
      <PrimaryButton label="Pular" variant="ghost" onPress={completeOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 22,
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 14,
  },
  heroCard: {
    minHeight: 300,
    justifyContent: 'center',
    marginBottom: 22,
  },
  illustrationHalo: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: colors.surfaceSoft,
    marginBottom: 20,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 22,
    fontSize: 15,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 22,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  primaryAction: {
    marginBottom: 12,
  },
});

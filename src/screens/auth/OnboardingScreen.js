import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';
import { palette, radii } from '../../theme/palette';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);

  const screens = [
    {
      title: 'Organize seus serviços',
      description: 'Registre atendimentos, acompanhe status e evite perder o ritmo do trabalho.'
    },
    {
      title: 'Envie orçamentos',
      description: 'Monte valores com clareza e compartilhe tudo com poucos toques.'
    },
    {
      title: 'Acompanhe seu faturamento',
      description: 'Veja o que entrou no mês e enxergue seu negócio com mais controle.'
    }
  ];

  const isLast = step === screens.length - 1;
  const handleNext = () => isLast ? completeOnboarding() : setStep((prev) => prev + 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.top}>
        <Text style={styles.brand}>Intaglio</Text>
        {!isLast && (
          <TouchableOpacity onPress={completeOnboarding}>
            <Text style={styles.skip}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>{screens[step].title}</Text>
        <Text style={styles.description}>{screens[step].description}</Text>
      </View>

      <SectionCard style={styles.featureCard}>
        <Text style={styles.featureTitle}>{screens[step].title}</Text>
        <Text style={styles.featureText}>{screens[step].description}</Text>
      </SectionCard>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {screens.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === step && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton title={isLast ? 'Começar' : 'Próximo'} onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.ink,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 28
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    color: palette.goldSoft,
    fontSize: 28,
    fontWeight: '700'
  },
  skip: {
    color: palette.goldSoft,
    fontSize: 14,
    fontWeight: '600'
  },
  hero: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    color: palette.paper,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 14
  },
  description: {
    color: '#CBC6BC',
    fontSize: 16,
    lineHeight: 24
  },
  featureCard: {
    backgroundColor: '#121214',
    borderColor: '#2A2418'
  },
  featureTitle: {
    color: palette.paper,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  featureText: {
    color: '#CFC9BE',
    lineHeight: 22
  },
  footer: {},
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#4B473F'
  },
  dotActive: {
    width: 22,
    backgroundColor: palette.gold,
    borderRadius: 999
  }
});

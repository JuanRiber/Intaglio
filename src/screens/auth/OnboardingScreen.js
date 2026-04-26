import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

/**
 * OnboardingScreen apresenta rapidamente o propósito do Nexo em três passos.
 * O usuário pode avançar entre as telas ou pular diretamente para iniciar.
 */
export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);

  const screens = [
    {
      title: 'Organize seus serviços',
      description: 'Registre todos os seus atendimentos em um único lugar e nunca perca o controle.'
    },
    {
      title: 'Envie orçamentos',
      description: 'Crie orçamentos profissionais e compartilhe rapidamente com seus clientes.'
    },
    {
      title: 'Acompanhe o faturamento',
      description: 'Veja quanto você ganhou no mês e tome decisões melhores para seu negócio.'
    }
  ];

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const { title, description } = screens[step];
  const isLast = step === screens.length - 1;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {screens.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, idx === step ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
        {isLast ? (
          <PrimaryButton title="Começar" onPress={handleNext} />
        ) : (
          <PrimaryButton title="Próximo" onPress={handleNext} />
        )}
        {!isLast && (
          <TouchableOpacity onPress={handleSkip} style={{ marginTop: 12 }}>
            <Text style={styles.skip}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    paddingHorizontal: 12
  },
  footer: {
    alignItems: 'center'
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  },
  dotActive: {
    backgroundColor: '#006aff'
  },
  dotInactive: {
    backgroundColor: '#555555'
  },
  skip: {
    color: '#888888',
    fontSize: 14
  }
});
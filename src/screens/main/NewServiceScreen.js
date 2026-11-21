import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useServices } from '../../context/ServicesContext';
import ServiceForm from '../../components/ServiceForm';

export default function NewServiceScreen() {
  const navigation = useNavigation();
  const { addService } = useServices();

  const handleSubmit = (data) => {
    addService(data);
    navigation.goBack();
  };

  return <ServiceForm title="Novo serviço" submitLabel="Salvar" onSubmit={handleSubmit} />;
}

import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../context/ServicesContext';
import ServiceForm from '../../components/ServiceForm';

export default function EditServiceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { services, editService } = useServices();
  const { serviceId } = route.params || {};
  const existing = services.find((svc) => svc.id === serviceId);

  useEffect(() => {
    if (!existing) navigation.goBack();
  }, [existing, navigation]);

  if (!existing) return null;

  const handleSubmit = (data) => {
    editService(serviceId, data);
    navigation.goBack();
  };

  return (
    <ServiceForm
      title="Editar serviço"
      submitLabel="Salvar alterações"
      initialValues={existing}
      onSubmit={handleSubmit}
    />
  );
}

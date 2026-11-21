import { Alert, Platform } from 'react-native';

/**
 * Diálogos que funcionam no app e na web. O Alert do React Native não faz
 * nada na web, então lá usamos window.confirm e window.alert.
 */

export function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

/** Pede confirmação e resolve com true (confirmou) ou false (cancelou). */
export function confirmAction({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', destructive = false }) {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
        { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) }
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}

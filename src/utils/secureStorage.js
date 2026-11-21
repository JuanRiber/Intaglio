import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Armazenamento para dados sensíveis (conta e credenciais).
 *
 * No iOS e no Android usa o Keychain/Keystore via expo-secure-store. Na web
 * não existe equivalente, então cai para o AsyncStorage (localStorage).
 */
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export async function getSecureItem(key) {
  if (!isNative) return AsyncStorage.getItem(key);
  const value = await SecureStore.getItemAsync(key);
  if (value !== null) return value;

  // Migração: dados antigos guardados no AsyncStorage passam para o cofre seguro
  const legacy = await AsyncStorage.getItem(key);
  if (legacy !== null) {
    await SecureStore.setItemAsync(key, legacy);
    await AsyncStorage.removeItem(key);
  }
  return legacy;
}

export async function setSecureItem(key, value) {
  if (!isNative) return AsyncStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

export async function removeSecureItem(key) {
  if (!isNative) return AsyncStorage.removeItem(key);
  await SecureStore.deleteItemAsync(key);
  await AsyncStorage.removeItem(key);
}

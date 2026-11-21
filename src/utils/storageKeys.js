import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureItem, setSecureItem, removeSecureItem } from './secureStorage';

/**
 * Chaves de armazenamento do Intaglio.
 *
 * Antes do nome Intaglio o app se chamava Nexo e usava chaves `nexo_*`. A
 * migração abaixo move os dados antigos para as chaves novas na primeira
 * abertura, sem perder contas, perfis nem serviços.
 */
export const STORAGE_KEYS = {
  onboardingSeen: 'intaglio_onboarding',
  user: 'intaglio_user',
  account: 'intaglio_account',
  loginGuard: 'intaglio_login_guard',
  services: 'intaglio_services',
  profile: 'intaglio_profile'
};

const LEGACY_KEYS = {
  onboardingSeen: 'nexo_apollo_onboarding',
  user: 'nexo_gaia_user',
  account: 'nexo_cernunnos_account',
  loginGuard: 'nexo_login_guard',
  services: 'nexo_athena_services',
  profile: 'nexo_athena_profile'
};

async function migrate() {
  try {
    for (const name of Object.keys(LEGACY_KEYS)) {
      const oldKey = LEGACY_KEYS[name];
      const newKey = STORAGE_KEYS[name];
      if (name === 'account') {
        // A conta fica no cofre seguro (ou no localStorage, na web)
        const oldValue = await getSecureItem(oldKey);
        if (oldValue !== null) {
          if ((await getSecureItem(newKey)) === null) await setSecureItem(newKey, oldValue);
          await removeSecureItem(oldKey);
        }
        continue;
      }
      const oldValue = await AsyncStorage.getItem(oldKey);
      if (oldValue === null) continue;
      if ((await AsyncStorage.getItem(newKey)) === null) await AsyncStorage.setItem(newKey, oldValue);
      await AsyncStorage.removeItem(oldKey);
    }
  } catch (err) {
    console.warn('Falha ao migrar dados da versão anterior', err);
  }
}

// Começa ao importar o módulo; os contextos aguardam antes de ler o armazenamento
export const legacyMigration = migrate();

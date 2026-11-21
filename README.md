# Nexo

Aplicativo para profissionais autônomos organizarem serviços, orçamentos, clientes e faturamento. Feito com Expo e React Native; todos os dados ficam salvos localmente no aparelho (AsyncStorage).

## Como rodar

```bash
npm install
npm start        # abre o Expo; use "i" (iOS), "a" (Android) ou "w" (web)
npm run build:web  # gera a versão web estática em web-build/
```

Ao publicar o site, sirva-o por HTTPS (o hash de senha usa `crypto.subtle`, que só existe em contexto seguro) e, se possível, envie também cabeçalhos como `Strict-Transport-Security` e `X-Content-Type-Options`.

## Estrutura

```
App.js                  providers e navegação raiz
src/context/            Auth, Profile e Services (estado + persistência local)
src/navigation/         fluxo raiz, autenticação e abas principais
src/screens/auth/       splash, onboarding, login, cadastro, perfil
src/screens/main/       início, serviços, clientes, financeiro, mais
src/components/         PrimaryButton, SectionCard, ServiceForm
src/utils/format.js     dinheiro, telefone, datas e totais
src/utils/security.js   hash de senha, verificação e força mínima
src/utils/secureStorage.js  cofre seguro (Keychain/Keystore) com fallback na web
web/index.html          template da versão web (CSP, título, estilos)
src/theme/palette.js    cores, sombras e raios
```

## Limitações conhecidas

- A conta fica só no aparelho: no app, o Keychain/Keystore guarda a conta com a senha em hash com salt; na web, o localStorage. Isso protege contra leitura casual, mas não substitui autenticação no servidor. Use um backend antes de publicar.
- A recuperação de senha apenas simula o envio do email.
- Não há sincronização: os dados vivem só neste aparelho.
- Expo SDK 49 está defasado e deve ser atualizado antes de publicar nas lojas. Muitas das vulnerabilidades restantes do `npm audit` só se resolvem com essa atualização.

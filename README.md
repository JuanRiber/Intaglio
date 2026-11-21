# Nexo

Aplicativo para profissionais autônomos organizarem serviços, orçamentos, clientes e faturamento. Feito com Expo e React Native; todos os dados ficam salvos localmente no aparelho (AsyncStorage).

## Como rodar

```bash
npm install
npm start        # abre o Expo; use "i" (iOS), "a" (Android) ou "w" (web)
```

## Estrutura

```
App.js                  providers e navegação raiz
src/context/            Auth, Profile e Services (estado + persistência local)
src/navigation/         fluxo raiz, autenticação e abas principais
src/screens/auth/       splash, onboarding, login, cadastro, perfil
src/screens/main/       início, serviços, clientes, financeiro, mais
src/components/         PrimaryButton, SectionCard, ServiceForm
src/utils/format.js     dinheiro, telefone, datas e totais
src/theme/palette.js    cores, sombras e raios
```

## Limitações conhecidas

- A conta e a senha ficam em texto puro no AsyncStorage. É só uma simulação de desenvolvimento; use um backend de autenticação antes de publicar.
- A recuperação de senha apenas simula o envio do email.
- Não há sincronização: os dados vivem só neste aparelho.
- Expo SDK 49 está defasado e deve ser atualizado antes de publicar nas lojas.

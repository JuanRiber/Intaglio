# Intaglio

Aplicativo para profissionais autônomos organizarem serviços, orçamentos, clientes e faturamento. Feito com Expo e React Native; todos os dados ficam salvos localmente no aparelho (AsyncStorage).

## Como rodar

```bash
npm install
npm start        # abre o Expo; use "i" (iOS), "a" (Android) ou "w" (web)
npm run build:web  # gera a versão web estática em dist/
```

Ao publicar o site, sirva-o por HTTPS (o hash de senha usa `crypto.subtle`, que só existe em contexto seguro) e, se possível, envie também cabeçalhos como `Strict-Transport-Security` e `X-Content-Type-Options`.

## Publicar o site (PWA)

O build web (`npm run build:web`) gera a pasta `dist/` com o app instalável e funcional offline (service worker em `public/sw.js`).

- **Vercel:** importe o repositório; o `vercel.json` já define o build e os cabeçalhos de segurança.
- **Netlify ou Cloudflare Pages:** build `npm run build:web`, pasta `dist`; o arquivo `public/_headers` aplica os cabeçalhos.
- **GitHub Pages (subpasta):** a subpasta é o nome do repositório, hoje `Nexo`. Gere o build com `EXPO_BASE_URL=/Nexo npm run build:web`. O GitHub Pages não permite cabeçalhos HTTP próprios, então só vale a CSP da tag `<meta>`.

No iPhone, o usuário abre o link no Safari e usa Compartilhar → Adicionar à Tela de Início.

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
public/index.html       template da versão web (CSP, título, estilos)
public/manifest.webmanifest  manifesto de instalação (PWA)
public/sw.js            service worker (cache e uso offline)
public/_headers, vercel.json  cabeçalhos de segurança por hospedagem
app.config.js           permite publicar em subpasta via EXPO_BASE_URL
src/theme/palette.js    cores, sombras e raios
```

## Limitações conhecidas

- A conta fica só no aparelho: no app, o Keychain/Keystore guarda a conta com a senha em hash com salt; na web, o localStorage. Isso protege contra leitura casual, mas não substitui autenticação no servidor. Use um backend antes de publicar.
- A recuperação de senha apenas simula o envio do email.
- Não há sincronização: os dados vivem só neste aparelho.
- Para impedir que o site seja embutido em outros (clickjacking), envie `frame-ancestors 'none'` (ou o cabeçalho `X-Frame-Options`) pelo servidor; a CSP em `<meta>` não suporta essa diretiva.

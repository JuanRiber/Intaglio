# Changelog

## 0.6.1
- conclui a renomeação para Intaglio: o repositório do GitHub passa a se chamar Intaglio e o site, `juanriber.github.io/Intaglio`
- as chaves de armazenamento passam de `nexo_*` para `intaglio_*`, com migração automática na primeira abertura, sem perder conta, perfil nem serviços
- `EXPO_BASE_URL` e o workflow de publicação usam `/Intaglio`

## 0.6.0
- o app passa a se chamar Intaglio: telas, título, manifesto, service worker, `app.json` (nome, slug, scheme e identificadores de pacote) e `package.json`
- novos ícones, com um "I" dourado no lugar do "N"
- corrige o título da aba do navegador, que aparecia como "undefined"
- as chaves de armazenamento continuam com o prefixo `nexo_` para não apagar os dados de quem já usa o app
- o repositório e a subpasta do GitHub Pages continuam como `Nexo`

## 0.5.0
- adiciona "Excluir minha conta" na tela Mais: pede a senha e apaga conta, perfil, serviços, login e controle de tentativas do aparelho
- corrige os avisos e confirmações na web, onde `Alert.alert` não faz nada (excluir serviço e avisos do WhatsApp não funcionavam no PWA)
- lista de serviços vazia não deixa mais uma chave `[]` no armazenamento

## 0.4.1
- PWA completo: service worker com uso offline, ícones 192/512 e maskable, apple-touch-icon e metadados para iOS
- caminhos do manifesto e dos ícones relativos, para funcionar na raiz ou em subpasta
- `app.config.js` aceita `EXPO_BASE_URL` para publicar em subpasta (GitHub Pages)
- cabeçalhos de segurança (CSP, HSTS, nosniff, X-Frame-Options e outros) em `public/_headers` e `vercel.json`
- README com instruções de publicação

## 0.4.0
- atualiza o Expo SDK 49 para o 58 (com React 19 e React Native 0.88)
- atualiza o React Navigation 6 para o 7
- remove `react-native-reanimated` e `@expo/webpack-config`, que o app não usava, e simplifica o `babel.config.js`
- a versão web passa a usar o Metro: template em `public/index.html`, manifesto em `public/manifest.webmanifest` e `npm run build:web` agora roda `expo export --platform web`
- corrige o fluxo de completar perfil, que no Navigation 7 não voltava para as abas; a edição de perfil agora volta à tela anterior
- vulnerabilidades de dependências de produção caem de 48 para 3 (moderadas)
- remove `frame-ancestors` da CSP em `<meta>`, que o navegador ignora (deve ser enviado como cabeçalho HTTP)

## 0.3.0
- senha passa a ser guardada como hash SHA-256 com salt e iterações; contas antigas em texto puro são migradas no primeiro login
- conta guardada no Keychain/Keystore via expo-secure-store (na web, localStorage)
- bloqueio de 60s após 5 tentativas de login falhas
- senha com mínimo de 8 caracteres, misturando letras e números
- recuperação de senha responde sempre igual, sem revelar quais emails estão cadastrados
- telas de autenticação tratam erros e usam dicas de autopreenchimento
- `npm audit fix` reduz as vulnerabilidades de dependências de 75 para 48
- versão web: template próprio com política de segurança de conteúdo (CSP), título, descrição, foco visível e aviso sem JavaScript
- versão web: layout limitado a 520px de largura e centralizado em telas grandes
- adiciona ícones do app, favicon e configuração de PWA (nome, cores, idioma)

## 0.2.1
- adiciona `app.json` e `babel.config.js` (plugin do Reanimated) para o projeto rodar em um clone limpo
- aceita vírgula nos valores em reais e formata moeda e datas em pt-BR
- unifica os formulários de novo e editar serviço em um único componente
- valida e normaliza os dados lidos do armazenamento para evitar travamentos
- troca `uuid` por um gerador de id próprio, que não depende de `crypto.getRandomValues`
- normaliza o telefone (DDI 55) no envio do orçamento por WhatsApp e avisa quando falha
- agrupa clientes pelo telefone e corrige a contagem de "Serviços ativos" e "Pagos no mês"
- troca o gráfico decorativo do dashboard por faturamento real dos últimos 6 meses
- torna os atalhos do dashboard funcionais e marca itens ainda não implementados como "Em breve"
- valida email e tamanho mínimo da senha no cadastro e impede cadastro duplicado
- adiciona README com estrutura e limitações conhecidas

## 0.1.4
- adiciona fluxo local de splash, onboarding, login, cadastro e recuperação de senha
- adiciona perfil profissional com persistência local
- reorganiza a navegação principal para Início, Serviços, Clientes, Financeiro e Mais
- adiciona dashboard inicial, lista de clientes e visão financeira básica
- mantém o fluxo de serviços com cadastro, edição, status, WhatsApp e exclusão
- ajusta o padrão de comentários e nomes para um estilo mais limpo

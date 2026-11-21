# Changelog

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

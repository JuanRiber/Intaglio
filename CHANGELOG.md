# Changelog

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

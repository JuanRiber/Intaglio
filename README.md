# Nexo – Organização de serviços para autônomos

![Nexo banner](https://via.placeholder.com/1200x400?text=Nexo+App)

Nexo é um aplicativo mobile (desenvolvido em **React Native/Expo**) voltado para profissionais autônomos que prestam serviços de manutenção de máquinas e equipamentos. A proposta é oferecer uma solução simples e descomplicada para organizar orçamentos, acompanhar serviços e visualizar o faturamento mensal.

Inspirado nos riffs de **Led Zeppelin**, na intensidade do **Black Sabbath** e na poesia de **The Doors**, o Nexo é construído com carinho para que o usuário sinta que está no controle de sua própria “Stairway to Heaven” profissional. Também buscamos referências filosóficas em **Carl Jung** e **Nietzsche**, que nos lembram da importância de organizar o mundo interno e externo para alcançar a individuação.

## Funcionalidades

- **Cadastro de serviços:** Informe cliente, telefone, equipamento, descrição do problema, peças utilizadas e valor de mão de obra. Cada serviço é salvo com status inicial "aguardando".
- **Acompanhamento de status:** Atualize as etapas do serviço (aguardando, em serviço, pronto, entregue ou pago) e visualize facilmente em que fase cada trabalho está.
- **Orçamento estruturado:** Visualize peças, mão de obra e o total do serviço em uma tela detalhada. Compartilhe rapidamente o orçamento com o cliente via WhatsApp.
- **Faturamento mensal:** Ao marcar um serviço como pago, o valor é contabilizado automaticamente no resumo do faturamento do mês corrente, permitindo uma visão rápida dos ganhos.

## Estrutura do projeto

O projeto utiliza **Expo** para simplificar o desenvolvimento e a execução do aplicativo. A estrutura principal é a seguinte:

```
nexo/
├── App.js                  # Configuração das rotas e navegação
├── package.json            # Dependências e scripts
├── src/
│   ├── context/
│   │   └── ServicesContext.js    # Gerenciamento global de serviços
│   ├── screens/
│   │   ├── HomeScreen.js         # Lista de serviços e faturamento
│   │   ├── NewServiceScreen.js   # Formulário para criar serviço
│   │   └── ServiceDetailScreen.js# Detalhes e atualização de status
│   └── ...
└── ...
```

## Como executar localmente

> Observação: devido a limitações deste ambiente de desenvolvimento, as dependências podem não ser instaladas automaticamente aqui. Siga os passos em sua máquina local para rodar o projeto.

1. Certifique‑se de ter [Node.js](https://nodejs.org/) e [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) instalados.
2. Clone este repositório e navegue até a pasta `nexo`:
   ```bash
   git clone <url-do-repositorio>
   cd nexo
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o projeto:
   ```bash
   npm start
   ```
   Use o app **Expo Go** no seu smartphone para escanear o QR Code e testar.

## Próximos passos

Este é apenas o primeiro ato. A partir de agora, podemos evoluir o Nexo conforme o feedback dos usuários, adicionando sincronização com back‑end, armazenamento em nuvem, notificações e muito mais. Vamos compor essa sinfonia juntos.

---

Com uma pitada de **rock** e filosofia, esperamos que o Nexo seja a ponte (ou o "nexo") que faltava na rotina de muitos profissionais. Boa jornada e bons serviços! 🎸
# Protótipo de Sistema de Autenticação com Papéis (RBAC)

Este repositório contém o código-fonte de um protótipo web full-stack que implementa um sistema completo de autenticação e gerenciamento de perfis. A aplicação permite o cadastro de usuários com diferentes papéis (ex: Cliente, Administrador) e controla o acesso a rotas e componentes com base nesse papel.

## 🚀 Tecnologias Utilizadas

-   **Frontend:** React (com Vite), React Router DOM
-   **Backend & DB:** Firebase (Authentication, Cloud Firestore)
-   **UI (Componentes):** Chakra UI
-   **Gerenciamento de Estado (Auth):** React Context

---

## ⚙️ Guia de Apresentação e Configuração Local

Este guia explica como configurar e executar o projeto em uma nova máquina e fornece um roteiro para demonstrar todas as funcionalidades implementadas.

### 1. Configuração do Ambiente

Siga estes passos para preparar o projeto para execução.

#### **Pré-requisitos**

-   É necessário ter o **Node.js** instalado na máquina. Para verificar, abra o terminal e rode `node -v`. Se não estiver instalado, baixe-o do [site oficial](https://nodejs.org/).

#### **Passo a Passo**

1.  **Clonar o Repositório**
    Abra o terminal e clone este repositório para a sua máquina:
    ```bash
    git clone [https://github.com/Nymeriasz/AllServe.git](https://github.com/Nymeriasz/AllServe.git)
    ```
    *(Substitua pela URL correta se necessário)*

2.  **Navegar para a Pasta Principal do Frontend**
    O código do React está dentro da subpasta `projeto-faculdade-limpo`.
    ```bash
    cd AllServe/projeto-faculdade-limpo
    ```

3.  **Instalar as Dependências**
    Este comando irá ler o `package.json` e baixar todas as bibliotecas necessárias (React, Firebase, Chakra, etc.) para a pasta `node_modules`.
    ```bash
    npm install
    ```

4.  **Configurar as Chaves do Firebase**
    O projeto precisa das credenciais para se conectar ao back-end no Firebase.
    -   Dentro da pasta `src`, localize (ou crie) a pasta `firebase`.
    -   Dentro de `src/firebase`, localize (ou crie) o arquivo `config.js`.
    -   Certifique-se de que o conteúdo dele está correto, substituindo os placeholders pelos valores do seu projeto no [Firebase Console](https://console.firebase.google.com/) (Configurações do Projeto ⚙️ -> Seus apps -> Configuração do SDK -> Configuração).

    ```javascript
    // src/firebase/config.js
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    // Se estiver usando Storage, adicione a importação:
    // import { getStorage } from "firebase/storage";

    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET", // Necessário se usar Storage
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    // Se estiver usando Storage, exporte-o:
    // export const storage = getStorage(app);
    ```

5.  **Executar o Projeto**
    Com tudo instalado e configurado (e ainda dentro da pasta `projeto-faculdade-limpo`), inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O terminal mostrará um endereço local (geralmente `http://localhost:5173/` ou similar). Abra-o no seu navegador.

---

### 2. 🧪 Roteiro de Demonstração de Funcionalidades

Siga este roteiro para apresentar todos os requisitos do protótipo.

#### **Teste 1: Rota Protegida (Usuário Deslogado)**

-   **Ação:** Tente acessar a URL `/dashboard` diretamente no navegador.
-   **👉 Resultado Esperado:** A aplicação deve **redirecionar automaticamente** para a página de `/login`, provando que a rota está protegida.

#### **Teste 2: Cadastro de Usuários com Papéis**

-   **Ação:**
    1.  Navegue para `/signup`.
    2.  Crie um novo usuário com o papel **`cliente`**.
    3.  Crie um segundo usuário com o papel **`bartender`** (preenchendo os campos extras).
    4.  Crie um terceiro usuário com o papel **`administrador`**.
-   **👉 Verificação no Back-end:**
    1.  Abra o painel do **Firebase Authentication** e mostre que os três novos usuários foram criados.
    2.  Abra o **Cloud Firestore** e mostre a coleção `users` com os três documentos, cada um com o `uid`, `email` e o `role` correto salvo (e os campos extras para o bartender).

#### **Teste 3: Login e Acesso ao Dashboard (Cliente)**

-   **Ação:** Volte para a aplicação e faça login com o usuário **`cliente`**.
-   **👉 Resultado Esperado:** Redirecionado para o `/dashboard`. A página de boas-vindas mostra o e-mail e o papel "cliente". Links específicos para cliente (Avaliar Bartender, Histórico de Pagamentos) devem estar visíveis.

#### **Teste 4: Conteúdo Específico por Papel (Admin)**

-   **Ação:** Faça logout e login com o usuário **`administrador`**.
-   **👉 Resultado Esperado:** No Dashboard, além das informações de boas-vindas, o **"Painel do Administrador"** é exibido, junto com o link "Moderar Avaliações".

#### **Teste 5: Recuperação de Senha**

-   **Ação:** Faça logout. Na página de login, clique em **"Esqueci minha senha"**. Digite um e-mail cadastrado e envie.
-   **👉 Resultado Esperado:** Notificação de sucesso confirmando o envio do e-mail de redefinição.

#### **Teste 6: Busca e Filtro de Bartenders**

-   **Ação:** Faça login (qualquer usuário). Clique em "Buscar Bartenders" na Navbar.
    1.  Digite uma especialidade no filtro.
    2.  Selecione diferentes opções de ordenação (preço, avaliação).
-   **👉 Resultado Esperado:** A lista de cards de bartenders se atualiza dinamicamente conforme os filtros e a ordenação.

#### **Teste 7: Carrinho e Checkout Simulado**

-   **Ação:**
    1.  Na página de busca ou no perfil de um bartender, clique em "Adicionar ao Carrinho". Faça isso para 1 ou 2 bartenders.
    2.  Verifique se o ícone do carrinho na Navbar atualiza a contagem.
    3.  Clique no link "Carrinho" na Navbar (leva para `/checkout`).
    4.  Verifique se os itens estão listados, se a taxa e o total estão corretos.
    5.  Clique em "Pagar com Cartão (Simulado)".
-   **👉 Resultado Esperado:** Após um delay simulado, o usuário é redirecionado para `/payment-success`. O carrinho na Navbar deve voltar a zero.

#### **Teste 8: Histórico de Pagamentos**

-   **Ação:** Após o Teste 7, navegue para o Dashboard (se for cliente) e clique em "Ver Histórico de Pagamentos".
-   **👉 Resultado Esperado:** A página `/historico-pagamentos` deve exibir um card com os detalhes do pagamento simulado que acabou de ser feito.

---

### 3. 🧪 Executando os Testes Automatizados

Este projeto utiliza Cucumber.js para testes BDD (Behavior-Driven Development) e Vitest com React Testing Library para testes de unidade (TDD).

**Importante:** Execute todos os comandos de teste dentro da pasta `projeto-faculdade-limpo`.

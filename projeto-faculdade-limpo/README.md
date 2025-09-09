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
    git clone [URL_DO_SEU_REPOSITÓRIO_AQUI]
    ```

2.  **Navegar para a Pasta**
    ```bash
    cd nome-da-pasta-do-projeto
    ```

3.  **Instalar as Dependências**
    Este comando irá ler o `package.json` e baixar todas as bibliotecas necessárias (React, Firebase, Chakra, etc.) para a pasta `node_modules`.
    ```bash
    npm install
    ```

4.  **Configurar as Chaves do Firebase**
    O projeto precisa das credenciais para se conectar ao back-end no Firebase.
    -   Crie uma pasta `firebase` dentro da pasta `src`.
    -   Dentro de `src/firebase`, crie um arquivo chamado `config.js`.
    -   Cole o seguinte código nele, substituindo os valores pelos do seu projeto no [Firebase Console](https://console.firebase.google.com/) (Configurações do Projeto ⚙️ -> Seus apps -> Configuração do SDK -> Configuração).

    ```javascript
    // src/firebase/config.js
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    ```

5.  **Executar o Projeto**
    Com tudo instalado e configurado, inicie o servidor de desenvolvimento:
    ```bash
    cd projeto-faculdade-limpo
    npm run dev
    ```
    O terminal mostrará um endereço local (geralmente `http://localhost:5173/`). Abra-o no seu navegador.

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
    3.  Crie um segundo usuário com o papel **`administrador`**.
-   **👉 Verificação no Back-end:**
    1.  Abra o painel do **Firebase Authentication** e mostre que os dois novos usuários foram criados.
    2.  Abra o **Cloud Firestore** e mostre a coleção `users` com os dois documentos, cada um com o `uid`, `email` e o `role` correto salvo.

#### **Teste 3: Login e Acesso ao Dashboard**
-   **Ação:** Volte para a aplicação e faça login com o usuário **`cliente`**.
-   **👉 Resultado Esperado:** Você verá uma notificação de sucesso e será redirecionado para o `/dashboard`. A página de boas-vindas mostrará o e-mail e o papel "cliente".

#### **Teste 4: Conteúdo Específico por Papel (RBAC)**
-   **Ação:**
    1.  Clique no botão "Sair" na Navbar ou no Dashboard.
    2.  Agora, faça login com o usuário **`administrador`**.
-   **👉 Resultado Esperado:** No Dashboard, além das informações de boas-vindas, um **"Painel do Administrador"** (uma caixa vermelha) será exibido, provando que o conteúdo muda com base no papel do usuário.

#### **Teste 5: Recuperação de Senha**
-   **Ação:**
    1.  Faça logout novamente.
    2.  Na página de login, clique no link **"Esqueci minha senha"**.
    3.  Digite o e-mail de um dos usuários cadastrados e clique em "Enviar".
-   **👉 Resultado Esperado:** Uma notificação de sucesso aparecerá, confirmando que o e-mail de redefinição foi enviado pelo Firebase.

Com este roteiro, todas as funcionalidades do protótipo serão demonstradas de forma clara e lógica.


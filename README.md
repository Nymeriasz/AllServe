# 🍸 AllServe

O **AllServe** é um sistema web full-stack desenvolvido para **conectar clientes a profissionais de eventos**, com foco inicial em **bartenders**.  
A plataforma oferece uma experiência completa, permitindo **cadastro e autenticação de usuários com diferentes papéis** (como **Cliente**, **Bartender** e **Administrador**) e controle de acesso personalizado de acordo com cada função.  

Além da autenticação, o sistema possibilita **busca e visualização de perfis profissionais**, **chat para negociação de serviços**, **contratação direta**, **pagamento online simulado** e **avaliação pós-evento**.  
O objetivo é tornar o processo de contratação de profissionais de eventos mais simples, seguro e eficiente, centralizando todas as etapas em um único ambiente digital.


## 🚀 Tecnologias Utilizadas

- **Frontend:** React (com Vite), React Router DOM  
- **Backend & Banco de Dados:** Firebase (Authentication, Cloud Firestore)  
- **UI (Componentes):** Chakra UI  
- **Gerenciamento de Estado (Auth):** React Context  


## ⚙️ Guia de Instalação e Execução Local

Siga os passos abaixo para configurar o projeto em seu ambiente local.

### **Pré-requisitos**

- É necessário ter o **Node.js** instalado.  
  Para verificar, execute no terminal:
  ```bash
  node -v

### **Passo a Passo**

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Nymeriasz/AllServe.gi

2. **Acessar a pasta do projeto**
   ```bash
   cd AllServe/projeto-faculdade-limpo

3. **Instalar as dependências**
   ```bash
   npm install

4. **Executar o projeto**
   ```bash
   npm run dev

O terminal exibirá o endereço local (geralmente http://localhost:5173/).
Abra-o no navegador para visualizar o sistema.

## 📂 Estrutura do Projeto
```bash
AllServe/
│
├── projeto-faculdade-limpo/
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Imagens e ícones
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── context/             # Contexto de autenticação
│   │   ├── firebase/            # Configuração do Firebase
│   │   ├── pages/               # Páginas principais
│   │   ├── routes/              # Definição das rotas e proteção
│   │   └── main.jsx             # Ponto de entrada do React
│   ├── package.json
│   └── vite.config.js
│
└── README.md
``` 

## 🧪 Alguns testes 

### **1. Rota Protegida (Usuário Deslogado)**
- **Ação:** Acesse diretamente a URL `/dashboard`.  
- **Resultado Esperado:** O sistema deve redirecionar automaticamente para a tela de **login**, garantindo que o acesso é protegido.

---

### **2. Cadastro de Usuários com Papéis**
- **Ação:**  
  - Crie um usuário **cliente**, um **bartender** e um **administrador**.  
- **Verificação:**  
  - No **Firebase Authentication**, os três usuários devem aparecer criados.  
  - No **Cloud Firestore**, a coleção `users` deve conter documentos com o `uid`, `email` e o `role` correspondente.

---

### **3. Login e Acesso ao Dashboard**
- **Ação:** Faça login como **cliente**.  
- **Resultado Esperado:**  
  - Redirecionamento para `/dashboard`.  
  - Exibição de informações personalizadas (como histórico de pagamentos e avaliações).

---

### **4. Conteúdo Específico por Papel**
- **Ação:** Faça login como **administrador**.  
- **Resultado Esperado:**  
  - Exibição do **“Painel do Administrador”** com opções exclusivas, como **moderação de avaliações**.

---

### **5. Recuperação de Senha**
- **Ação:**  
  - Na tela de login, clique em **“Esqueci minha senha”** e insira um e-mail válido.  
- **Resultado Esperado:**  
  - Notificação confirmando o envio do e-mail de redefinição.

---

### **6. Busca e Filtro de Bartenders**
- **Ação:**  
  - Faça login e acesse a página de **busca**.  
  - Utilize os filtros de **especialidade** e **ordenação por preço/avaliação**.  
- **Resultado Esperado:**  
  - A listagem de bartenders é atualizada dinamicamente conforme os filtros aplicados.

---

### **7. Simulação de Pagamento**
- **Ação:**  
  - Adicione bartenders ao **carrinho** e prossiga para o **checkout**.  
  - Realize um **pagamento simulado**.  
- **Resultado Esperado:**  
  - Redirecionamento para a página de sucesso (`/payment-success`) e carrinho zerado.


## 🧪 Executando os testes automatizados

Este projeto utiliza Cucumber.js para testes BDD (Behavior-Driven Development) e Vitest com React Testing Library para testes de unidade (TDD).

**Importante:** Execute todos os comandos de teste dentro da pasta `projeto-faculdade-limpo`.

### **Testes BDD (Cucumber)**
Para executar os cenários descritos nos arquivos `.feature`:
```bash
npm run test:cucumber
```

## 📜 Licença

Este projeto foi desenvolvido com fins **acadêmicos e educacionais**.
O código pode ser utilizado livremente para estudos e aprimoramentos.

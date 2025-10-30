# 🍸 AllServe

O **AllServe** é um sistema web full-stack desenvolvido para **conectar clientes a profissionais de eventos**, com foco inicial em **bartenders**.  
A plataforma oferece uma experiência completa, permitindo **cadastro e autenticação de usuários com diferentes papéis** (como **Cliente**, **Bartender** e **Administrador**) e controle de acesso personalizado de acordo com cada função.  

Além da autenticação, o sistema possibilita **busca e visualização de perfis profissionais**, **chat para negociação de serviços**, **contratação direta**, **pagamento online simulado** e **avaliação pós-evento**.  
O objetivo é tornar o processo de contratação de profissionais de eventos mais simples, seguro e eficiente, centralizando todas as etapas em um único ambiente digital.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React (com Vite), React Router DOM  
- **Backend & Banco de Dados:** Firebase (Authentication, Cloud Firestore)  
- **UI (Componentes):** Chakra UI  
- **Gerenciamento de Estado (Auth):** React Context  

---

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



## 🧪 Executando os Testes Automatizados

Este projeto utiliza Cucumber.js para testes BDD (Behavior-Driven Development) e Vitest com React Testing Library para testes de unidade (TDD).

**Importante:** Execute todos os comandos de teste dentro da pasta `projeto-faculdade-limpo`.

### **Testes BDD (Cucumber)**
Para executar os cenários descritos nos arquivos `.feature`:
```bash
npm run test:cucumber

# 🍸 AllServe

O **AllServe** é uma plataforma web desenvolvida para conectar **clientes e bartenders profissionais**.  
A aplicação permite o cadastro de diferentes tipos de usuários, busca por profissionais, visualização de perfis, chat e contratação de serviços.

---

## 🚀 Tecnologias Utilizadas

- **React.js**  
- **Firebase (Authentication, Firestore, Storage, Functions)**  
- **Bootstrap 5**  
- **Lucide React e React Icons**  
- **React Router DOM**  

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado  
- Conta no [Firebase Console](https://console.firebase.google.com/)

### Passos

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Nymeriasz/AllServe.git

2. **Acessar o diretório do projeto**
   ```bash
   cd AllServe-main

3. **Instalar as dependênciass**
   ```bash
   npm install

4. **Executar o projeto**
   ```bash
   npm run dev

---

## 📁 Estrutura do Projeto
```bash
AllServe-main/
│
├── functions/                 # Funções serverless do Firebase (backend)
│   ├── index.js
│   ├── package.json
│   └── .eslintrc.js
│
├── public/                    # Arquivos públicos (favicon, index.html, imagens globais)
│
├── src/                       # Código-fonte do frontend (React)
│   ├── assets/                # Imagens, ícones e recursos visuais
│   ├── components/            # Componentes reutilizáveis (botões, cards, navbar, etc.)
│   ├── firebase/              # Configuração e inicialização do Firebase
│   ├── hooks/                 # Hooks customizados (ex: useAuth, useFirestore)
│   ├── pages/                 # Páginas principais da aplicação
│   │   ├── Login/
│   │   ├── Cadastro/
│   │   ├── Dashboard/
│   │   ├── PerfilBartender/
│   │   ├── Chat/
│   │   ├── Pagamento/
│   │   ├── Confirmacao/
│   │   └── Avaliacao/
│   ├── services/              # Serviços (consultas e interações com o Firebase)
│   ├── styles/                # Arquivos de estilo (CSS e Bootstrap customizado)
│   ├── App.jsx                # Componente raiz da aplicação
│   └── main.jsx               # Ponto de entrada da aplicação
│
├── .firebaserc                # Configuração de ambiente do Firebase
├── firebase.json              # Configuração de deploy do Firebase Hosting
├── package.json               # Dependências e scripts do projeto
├── vite.config.js             # Configuração do Vite
└── README.md                  # Documentação do projeto

```

---

## ☁️ Deploy
Para publicar no Firebase Hosting:
```bash
firebase deploy
```

---

## 📄 Licença
Este projeto foi desenvolvido como trabalho final do curso de Análise e Desenvolvimento de Sistemas (UNIFIP).

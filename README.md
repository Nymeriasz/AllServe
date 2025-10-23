# 🍸 AllServe

O **AllServe** é um sistema web desenvolvido para conectar clientes a profissionais de eventos, com foco inicial em bartenders.
A plataforma permite o cadastro de usuários, busca por profissionais, contratação de serviços, pagamento online e avaliação pós-evento, oferecendo uma experiência prática e segura para ambos os lados.


## 🚀 Tecnologias Utilizadas

- **React.js**  
- **Firebase (Authentication, Firestore, Storage, Functions)**  
- **Bootstrap 5**  
- **Lucide React e React Icons**  
- **React Router DOM**  


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


## 📁 Estrutura do Projeto
```bash
AllServe/
│
├── projeto-faculdade-limpo/       # Pasta principal da aplicação React
│ ├── public/ 
│ │
│ ├── src/                         # Código-fonte principal
│ │ ├── assets/                    # Imagens e ícones usados na interface
│ │ │
│ │ ├── components/                # Componentes reutilizáveis
│ │ │ ├── AdminPanel.jsx           # Painel administrativo
│ │ │ ├── BartenderCard.jsx        # Card de exibição de bartender
│ │ │ ├── Footer.jsx               # Rodapé do site
│ │ │ ├── Layout.jsx               # Estrutura padrão de layout
│ │ │ └── Navbar.jsx               # Barra de navegação principal
│ │ │
│ │ ├── context/                   # Contextos globais 
│ │ │
│ │ ├── firebase/                  # Configuração e integração com o Firebase
│ │ │
│ │ ├── pages/                     # Páginas da aplicação
│ │ │
│ │ ├── routes/                    # Definição das rotas e controle de navegação
│ │ │
│ │ ├── App.css                    # Estilos principais da aplicação
│ │ ├── App.jsx                    # Componente raiz da aplicação
│ │ ├── index.css                  # Estilos globais
│ │ └── main.jsx                   # Ponto de entrada da aplicação React
│ │
│ ├── index.html                   # HTML principal da aplicação
│ ├── package-lock.json            # Controle de versões das dependências
│ ├── package.json                 # Dependências e scripts do projeto
│ ├── README.md                    # Documentação do projeto
│ └── vite.config.js               # Configuração do bundler Vite
│
└── node_modules/                  # Dependências instaladas (gerado automaticamente)

```


## ☁️ Deploy
Para publicar no Firebase Hosting:
```bash
firebase deploy
```


## 📄 Licença
Este projeto foi desenvolvido como trabalho final do curso de Análise e Desenvolvimento de Sistemas (UNIFIP).

# SchoolManager

##  Visão Geral
O **SchoolManager** é um sistema de gerenciamento escolar desenvolvido para facilitar o controle de alunos, funcionários e finanças. Ele permite que escolas mantenham registros organizados e acessíveis, otimizando processos administrativos e melhorando a gestão educacional.

##  Tecnologias Utilizadas
### **Backend**
- Node.js
- NestJS
- TypeScript
- MySQL (ou outro banco de dados relacional)
- TypeORM
- Docker
- JWT para autenticação

### **Frontend**
- React.js
- Next.js
- TypeScript
- TailwindCSS
- Zustand (para gerenciamento de estado)

##  Estrutura do Repositório
```
SchoolManager/
│── backend/        # Código do backend (NestJS)
│── frontend/       # Código do frontend (Next.js)
│── README.md       # Documentação do projeto
```

###  **Backend**
```
backend/
│── src/
│   ├── auth/       # Módulo de autenticação
│   ├── children/   # Gestão de crianças/alunos
│   ├── employees/  # Gestão de funcionários
│   ├── finance/    # Gestão financeira
│   ├── users/      # Gestão de usuários
│── test/           # Testes unitários e de integração
│── docker-compose.yml  # Configuração do Docker
│── package.json    # Dependências do projeto
```

###  **Frontend**
```
frontend/
│── src/
│   ├── components/ # Componentes reutilizáveis
│   ├── hooks/      # Hooks personalizados
│   ├── layouts/    # Layouts globais
│   ├── pages/      # Páginas da aplicação
│   ├── services/   # Comunicação com a API
│   ├── store/      # Gerenciamento de estado
│── public/         # Assets estáticos
│── package.json    # Dependências do projeto
```

##  Como Rodar o Projeto Localmente
### **1. Clonar o repositório**
```bash
git clone https://github.com/SrMedeirosJr/SchoolManager.git
cd SchoolManager
```

### **2. Configurar o Backend**
```bash
cd backend
npm install
cp .env.example .env  # Criar o arquivo de ambiente e configurar variáveis
npm run start  
```

### **3. Configurar o Frontend**
```bash
cd ../frontend
npm install
npm run dev  
```

Acesse a aplicação no navegador: [http://localhost:3001](http://localhost:3001)

---

**Desenvolvido por [SrMedeirosJr](https://github.com/SrMedeirosJr)** 🚀
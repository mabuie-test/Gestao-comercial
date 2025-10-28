# Gestão Comercial Inteligente

Aplicação completa para gestão comercial moderna composta por API Node.js com MongoDB Atlas e SPA React com interface rica. O sistema inclui módulos de vendas, faturação com PDF, stock, clientes, utilizadores com papéis (admin e vendedor), painel inteligente e personalização de timbre/identidade da empresa.

## Estrutura

```
backend/   # API Express + MongoDB
frontend/  # Aplicação React + Vite + Material UI
```

## Funcionalidades principais

- **Autenticação JWT** com controlo de sessão, papéis `admin` e `vendedor` e gestão de utilizadores pelo administrador.
- **Gestão de produtos** com stock, movimentos automatizados, ajustes manuais e alertas de baixo stock.
- **Clientes** com contactos, NUIT, categorização e histórico de vendas.
- **Vendas e faturação** com geração automática de números de factura, controlo de pagamentos, cancelamento com estorno de stock e download de PDF (com timbre personalizável).
- **Dashboard inteligente** com métricas em tempo real, gráficos e últimos negócios.
- **Configurações corporativas** para personalizar identidade visual, timbre e dados exibidos em facturas.
- **Relatórios e APIs REST** preparados para integração externa.

## Pré-requisitos

- Node.js 18+
- Conta MongoDB Atlas e string de ligação

## Configuração do backend

```bash
cd backend
cp .env.example .env
# actualizar MONGODB_URI e JWT_SECRET
npm install
npm run dev
```

A API arranca por omissão em `http://localhost:4000`. O primeiro arranque cria um utilizador administrador padrão:

- **Email:** `admin@sistema.co.mz`
- **Senha:** `admin123`

> Recomenda-se alterar a senha após o login.

## Configuração do frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

A interface ficará disponível em `http://localhost:5173` e comunica com a API definida em `VITE_API_URL`.

## Scripts úteis

### Backend

- `npm run dev` – servidor com *hot reload* (nodemon).
- `npm run start` – execução em produção.
- `npm run lint` – validação com ESLint.

### Frontend

- `npm run dev` – servidor de desenvolvimento Vite.
- `npm run build` – build de produção.
- `npm run preview` – pré-visualização do build.
- `npm run lint` – lint React/TypeScript.

## Fluxo operacional sugerido

1. Inicie o backend e faça login com o utilizador administrador.
2. Configure os dados da empresa e timbre em **Configurações**.
3. Cadastre produtos e clientes.
4. Registe vendas, emita facturas (PDF) e acompanhe o painel.
5. Administre utilizadores e permissões conforme necessidade.

## Segurança e escalabilidade

- Estrutura modular com validação de dados (`express-validator`).
- JWT com expiração, middleware de papéis e logging com Morgan/Helmet.
- Serviços separados para geração de números de factura e integração com MongoDB.
- Frontend desacoplado, pronto para implantação em CDN/edge.

## Personalização

- Ajuste facilmente o tema (Material UI) em `frontend/src/utils/theme.ts`.
- Configure prefixo/numeração e timbre via API ou interface administrativa.
- Extensível para integrações (pagamentos, ERP) através dos endpoints RESTful.

## Licença

MIT

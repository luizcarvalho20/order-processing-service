# Order Processing Service

Serviço backend para criação e processamento assíncrono de pedidos
usando filas (BullMQ), com testes automatizados e CI.

## 🧱 Stack

-   Node.js + Express + TypeScript
-   Prisma
-   PostgreSQL (Docker)
-   Redis + BullMQ (fila e worker)
-   Jest + Supertest (testes)
-   GitHub Actions (CI)
-   Pino / prom-client (logs e métricas)

------------------------------------------------------------------------

## 🏗️ Arquitetura

**Componentes principais:** - **API (HTTP)**: recebe requisições para
criar pedidos e consultar status. - **PostgreSQL**: persistência de
pedidos e itens. - **Redis**: broker de fila. - **BullMQ Worker**:
processa pedidos em background.

### 🔄 Fluxo assíncrono (alto nível)

1.  Cliente chama `POST /orders`
2.  API:
    -   salva pedido + itens no PostgreSQL
    -   enfileira um job no Redis (BullMQ)
    -   retorna o pedido com status inicial (ex: `PENDING`)
3.  Worker:
    -   consome o job
    -   executa a lógica de processamento (ex: calcula total, valida,
        atualiza status)
    -   atualiza status no PostgreSQL (ex: `COMPLETED` ou `FAILED`)
4.  Cliente consulta `GET /orders/:id` para ver status/resultado

------------------------------------------------------------------------

## ✅ Endpoints (exemplo)

-   `GET /health` -- healthcheck do serviço
-   `POST /orders` -- cria pedido e enfileira processamento
-   `GET /orders/:id` -- consulta pedido e status

> Ajuste esta lista conforme os endpoints reais do projeto.

------------------------------------------------------------------------

## 🚀 Como rodar localmente

### Pré-requisitos

-   Node.js 20+
-   Docker + Docker Compose

### Subir dependências (Postgres + Redis)

``` bash
docker compose up -d
```

### Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

``` env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/order_processing?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379
```

> Em produção/CI, essas variáveis podem ser injetadas pelo ambiente.

### Instalar dependências e preparar banco

``` bash
npm ci
npx prisma generate
npx prisma migrate dev
```

### Rodar a API (modo desenvolvimento)

``` bash
npm run dev
```

### Rodar o Worker (modo desenvolvimento, em outro terminal)

``` bash
npm run worker:dev
```

### Build e rodar em produção

``` bash
npm run build
npm start
```

------------------------------------------------------------------------

## 🧪 Testes

``` bash
npm test
```

-   Testes unitários: validações e regras de negócio
-   Testes de integração: API + banco + fluxo assíncrono
-   Os testes rodam em modo serial (`--runInBand`) para evitar conflitos
    com recursos compartilhados

------------------------------------------------------------------------

## 🔁 CI (GitHub Actions)

O pipeline roda automaticamente em **push** e **pull request** para
`main`, subindo: - PostgreSQL (service) - Redis (service)

E executa: - instalação de dependências (`npm ci`) - Prisma generate +
migrations - testes (`npm test`)

Arquivo: `.github/workflows/ci.yml`

------------------------------------------------------------------------

## 📌 Observabilidade

-   Logs estruturados com **Pino**
-   Métricas com **prom-client**
-   Healthcheck disponível em `GET /health`

------------------------------------------------------------------------

## 📂 Scripts úteis

-   `npm run dev` -- roda a API em modo desenvolvimento
-   `npm run worker:dev` -- roda o worker em modo desenvolvimento
-   `npm run build` -- compila o TypeScript
-   `npm start` -- roda a API compilada
-   `npm run prisma:migrate` -- executa migrações no banco
-   `npm test` -- executa os testes

------------------------------------------------------------------------

## 👤 Autor

**Luiz Felipe Carvalho**\
LinkedIn: https://www.linkedin.com/in/luizcarvalho20

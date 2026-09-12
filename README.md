<h1 align="center">Brokerage Lab 💲</h1>

<p align="center">
  Laboratório fullstack com domínio de corretora (Conta, Ativo, Ordem) que evolui em infraestrutura por fases: auth, transações ACID, filas, cache e observabilidade.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/NestJS-BFF-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/.NET-8-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/PostgreSQL-db-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-cache-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/RabbitMQ-queues-FF6600?style=flat-square&logo=rabbitmq&logoColor=white" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/Keycloak-OIDC-008AAA?style=flat-square&logo=keycloak&logoColor=white" alt="Keycloak" />
  <img src="https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker Compose" />
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre o projeto</a> ·
  <a href="#arquitetura">Arquitetura</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#fases">Fases</a> ·
  <a href="#como-rodar">Como rodar</a> ·
  <a href="#objetivo-de-aprendizado">Objetivo de aprendizado</a>
</p>

---

## Sobre o projeto

Laboratório de aprendizado fullstack com domínio de corretora simplificado: Conta, Ativo e Ordem. Cada fase adiciona uma camada de complexidade real (auth, transações, filas, cache, observabilidade) sobre o mesmo domínio.

A stack cobre o ciclo completo de uma aplicação financeira de produção: frontend SPA, BFF com camadas bem definidas, backend REST, banco relacional, cache, mensageria e observabilidade. Tudo roda localmente via docker-compose, sem dependência de cloud.

---

## Arquitetura
<img width="1698" height="926" alt="image" src="https://github.com/user-attachments/assets/0dae592e-786e-4010-b4c3-1b804553cc7c" />


---

## Stack

| Camada          | Tecnologia                         |
|-----------------|------------------------------------|
| Web             | Vue 3 + Vite + TypeScript          |
| BFF             | NestJS (presentation → aggregator) |
| Backend         | .NET 8                             |
| Banco de dados  | PostgreSQL                         |
| Cache           | Redis                              |
| Mensageria      | RabbitMQ                           |
| Auth            | Keycloak (OIDC/PKCE)               |
| Observabilidade | Grafana, Prometheus, Loki          |
| Infraestrutura  | Docker Compose (local)             |

---

## Fases

Status de cada fase: ✅ concluída · 🚧 em andamento · ⬜ planejada

### Fase 0 — Walking Skeleton (N+1) ✅
**Goal:** Conexão end-to-end funcional.

`Web → BFF → .NET → PostgreSQL`

- Rota `GET /orders` atravessa toda a stack
- Problema N+1 introduzido intencionalmente e medido antes de corrigir

<img width="600"  alt="image" src="https://github.com/user-attachments/assets/dca680cf-8845-42a5-9c64-4d544a343d7f" />

---

### Fase 1 — Autenticação (Auth) ✅
**Goal:** Rotas seguras com identidade verificada.

- Login via Keycloak com OAuth2 + PKCE
- BFF valida JWT via JWKS
- Guards no NestJS
- RBAC gate antes do acesso ao banco

<img width="400" alt="image" src="https://github.com/user-attachments/assets/39671a06-b110-4961-bd5e-44b6b05dddfc" />
<img width="400" alt="image" src="https://github.com/user-attachments/assets/1286a916-7316-4e3d-88fe-28359b312915" />

---

### Fase 2 — Escrita Correta (Transaction) ✅
**Goal:** Escrita segura de dados.

- `POST /orders` com `Idempotency-Key`
- Transação ACID: Start → Debit Saldo → Insert Ordem → Commit
- Tratamento de falha durante o commit
- Timeout e erro downstream controlados

---

### Fase 3 — Processamento Assíncrono (RabbitMQ) ✅
**Goal:** Desacoplar processamento da resposta HTTP.

- `POST /orders` retorna `202 Pending` imediatamente
- Ordem publicada na fila RabbitMQ
- Worker processa, publica evento no exchange
- Web faz polling para checar status

<img width="920" height="285" alt="image" src="https://github.com/user-attachments/assets/7d805350-82f7-4c80-a3e3-94cb875930f5" />

---

### Fase 4 — Cache e Performance (Redis) ✅
**Goal:** Reduzir latência em leituras de preço.

- `GET /assets/price` consulta Redis antes do banco
- Cache HIT retorna direto; MISS busca no banco e escreve no Redis com TTL
- Invalidação ativa na mudança de preço

<img width="1343" height="471" alt="image" src="https://github.com/user-attachments/assets/373e0d8f-ca7b-4bf0-a5c1-c6a1e090fc33" />

---

### Fase 5 — Observabilidade e Logging 🚧 em andamento
**Goal:** Investigação rápida de incidentes.

- `correlationId` gerado na borda e propagado via `AsyncLocalStorage`
- Logs estruturados em JSON enviados ao Loki
- Métricas expostas ao Prometheus
- Dashboard Grafana com alerta de alta latência

---

## Como rodar

```bash
# Pré-requisito: Docker e Docker Compose instalados

cp bff/.env.example bff/.env

make infra        # sobe Postgres, Keycloak, RabbitMQ e Redis
make dev          # sobe a infra e roda API (.NET), BFF (NestJS) e Web (Vue)
make stop         # para os processos e os containers
make infra-reset  # recria a infra do zero (apaga os volumes)
```

Sem o Makefile, a infraestrutura sobe com `docker compose up -d`.

Cada fase tem sua própria branch e pode ser executada de forma isolada.

---

## Links e credenciais locais

| Serviço              | URL                                       | Usuário | Senha |
|----------------------|-------------------------------------------|---------|-------|
| Web (Vue)            | http://localhost:5173                     | —       | —     |
| BFF (NestJS)         | http://localhost:3000                     | —       | —     |
| API (.NET / Swagger) | http://localhost:5089/swagger             | —       | —     |
| Keycloak (admin)     | http://localhost:8080/admin               | admin   | admin |
| RabbitMQ Management  | http://localhost:15672                    | guest   | guest |
| Redis Insight        | http://localhost:8001                     | —       | —     |

> **Keycloak:** o realm `corretora` e o client `corretora-web` são criados manualmente na primeira execução. Credenciais de usuário de teste criadas pelo próprio Keycloak via registro na tela de login.
>
> **Redis Insight:** ao abrir pela primeira vez, adicione uma conexão com hostname `redis` e porta `6379` (use o nome do serviço Docker, não `localhost`).

---

## Objetivo de aprendizado

Cada fase existe para expor um problema de infraestrutura real antes de resolvê-lo. O fluxo é sempre:

1. Fazer do jeito ingênuo
2. Medir ou quebrar
3. Corrigir com entendimento do trade-off

O critério de conclusão de cada fase é conseguir explicar verbalmente o trade-off da decisão tomada — não apenas ter o código funcionando.

---

<p align="center">
  Desenvolvido por <strong>Luiz Eduardo Veltroni</strong> ·
  <a href="https://github.com/EduardooPV">GitHub</a> ·
  <a href="https://www.linkedin.com/in/luiz-veltroni/">LinkedIn</a>
</p>

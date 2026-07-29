# Corretora Lab 💲

Laboratório de aprendizado fullstack com domínio de corretora simplificado: Conta, Ativo e Ordem. Cada fase adiciona uma camada de complexidade real (auth, transações, filas, cache, observabilidade) sobre o mesmo domínio.

A stack cobre o ciclo completo de uma aplicação financeira de produção: frontend SPA, BFF com camadas bem definidas, backend REST, banco relacional, cache, mensageria e observabilidade. Tudo roda localmente via docker-compose, sem dependência de cloud.

# Arquitetura 

<img width="1408" height="768" alt="arquitetura-do-projeto" src="https://github.com/user-attachments/assets/b8b945a9-8d35-4cc4-bda2-bdd965cfaac2" />

## Stack

| Camada         | Tecnologia                      |
|----------------|---------------------------------|
| Web            | Vue 3 + Vite + TypeScript       |
| BFF            | NestJS (presentation → aggregator) |
| Backend        | .NET 8                          |
| Banco de dados | PostgreSQL                      |
| Cache          | Redis                           |
| Mensageria     | RabbitMQ                        |
| Auth           | Keycloak (OIDC/PKCE)            |
| Observabilidade | Grafana, Prometheus, Loki      |
| Infraestrutura | Docker Compose (local)          |

---

## Fases

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

### Fase 3 — Processamento Assíncrono (RabbitMQ) 🚧 em andamento
**Goal:** Desacoplar processamento da resposta HTTP.

- `POST /orders` retorna `202 Pending` imediatamente
- Ordem publicada na fila RabbitMQ
- Worker processa, publica evento no exchange
- Web faz polling para checar status

---

### Fase 4 — Cache e Performance (Redis) ⬜ planejado
**Goal:** Reduzir latência em leituras de preço.

- `GET /assets/price` consulta Redis antes do banco
- Cache HIT retorna direto; MISS busca no banco e escreve no Redis com TTL
- Invalidação ativa na mudança de preço

---

### Fase 5 — Observabilidade e Logging ⬜ planejado
**Goal:** Investigação rápida de incidentes.

- `correlationId` gerado na borda e propagado via `AsyncLocalStorage`
- Logs estruturados em JSON enviados ao Loki
- Métricas expostas ao Prometheus
- Dashboard Grafana com alerta de alta latência

---

## Como rodar

```bash
# Pré-requisito: Docker e Docker Compose instalados

docker-compose up -d
```

Cada fase tem sua própria branch e pode ser executada de forma isolada.

---

## Objetivo de aprendizado

Cada fase existe para expor um problema de infraestrutura real antes de resolvê-lo. O fluxo é sempre:

1. Fazer do jeito ingênuo
2. Medir ou quebrar
3. Corrigir com entendimento do trade-off

O critério de conclusão de cada fase é conseguir explicar verbalmente o trade-off da decisão tomada — não apenas ter o código funcionando.

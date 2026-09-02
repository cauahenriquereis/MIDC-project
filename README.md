# Sistema de Gestão e Monitoramento de Entregas (MIDC)

Solução full-stack consolidada para entrada de dados operacionais e visualização gerencial em tempo real, orquestrada via Docker.

---

## Arquitetura e Decisões de Design

A aplicação adota uma arquitetura descentralizada de micro-serviços com separação clara de responsabilidades:

* **PostgreSQL (Banco de Dados)**: Persistência relacional para garantir a integridade dos dados de entregas.
* **FastAPI / Python (Backend)**: API REST assíncrona responsável pelas regras de negócio, validações via Pydantic e integração com o banco via SQLAlchemy. Expõe endpoints para listagem e agregação de dados.
* **Angular (Frontend - Operacional)**: Aplicação focada na entrada e formulários de cadastro de novos registros por operadores.
* **React + Vite + Tailwind v4 + Recharts (Frontend - Gerencial)**: Dashboard responsivo voltado a gestores para exibição de KPIs agregados e gráficos em tempo real.

---

## Como Iniciar o Ambiente

### Pré-requisito

* **Docker Desktop** instalado e em execução na máquina local.

### Execução via Docker Compose (Recomendado)

Na raiz do projeto, execute o comando:

```bash
docker compose up --build

```

Todas as dependências serão baixadas, as imagens construídas e as quatro aplicações subirão de forma automatizada.

---

## Mapeamento de Portas

| Serviço | Tecnologia | URL de Acesso | Descrição |
| --- | --- | --- | --- |
| **Frontend Operacional** | Angular | `http://localhost:4200` | Formulário para cadastro e entrada de dados |
| **Dashboard Gerencial** | React / Vite | `http://localhost:5173` | Painel com métricas, gráficos e tabela de entregas |
| **API REST Backend** | FastAPI / Python | `http://localhost:8001` | Endpoints da aplicação (`/records` e `/summary`) |
| **Documentação da API** | Swagger UI | `http://localhost:8001/docs` | Interface para teste e especificação dos endpoints |
| **Banco de Dados** | PostgreSQL | `localhost:5432` | Instância do banco de dados relacional |

---

## Limitações Conhecidas e Itens Pendentes (Janela de 4 horas)

Devido à restrição do tempo limite do desafio, as seguintes otimizações não foram concluídas:

1. **Testes Automatizados**: Não foi possível implementar a cobertura de testes unitários ou de integração no backend (Pytest) e nos frontends (Jasmine/Jest).
2. **Autenticação e Autorização**: A API e os frontends estão abertos sem camada de controle de acesso (JWT/OAuth2).
3. **Mecanismo de Healthcheck / Retry no Docker**: O script de inicialização do backend confia no `depends_on` básico do Docker, sem script de checagem para aguardar o Postgres estar 100% pronto antes de executar as tabelas.
4. **Tratamento de CORS em Produção**: O CORS no FastAPI está configurado de forma permissiva (`"*"`) para facilitar a comunicação rápida entre contêineres e aplicações no ambiente local.

Desafio Integrador 2026

Sistema fullstack de gestão de clientes, produtos e pedidos, com análise preditiva de churn via Machine Learning.



Visão Geral

A aplicação é dividida em três camadas independentes:

Camada

Tecnologia

Porta

Frontend

Next.js 16 + React 19 + Tailwind CSS

3000

Backend

NestJS 11 + Prisma + PostgreSQL

3001

ML Service

FastAPI + scikit-learn (Random Forest)

8000



Funcionalidades

Cadastro e gestão de clientes, produtos, categorias e pedidos

Dashboard com métricas e indicadores de negócio

Gráficos analíticos de vendas e desempenho

Relatórios exportáveis

Análise de churn por cliente — previsão de risco de abandono usando modelo Random Forest (acurácia \~85,9%)

Decisão assistida com scoring de propensão de compra

Documentação automática da API via Swagger em http://localhost:3001/docs



Pré-requisitos

Certifique-se de ter instalado:

Node.js v20 ou superior

npm v10 ou superior

Python 3.10 ou superior

PostgreSQL 14 ou superior



Instalação e Execução

1\. Clone o repositório

bash

git clone https://github.com/seu-usuario/Desafio-Integrador-2026.git

cd Desafio-Integrador-2026



2\. Backend (NestJS)

Variáveis de ambiente

Crie o arquivo .env dentro da pasta backend/:

env

DATABASE\_URL="postgresql://usuario:senha@localhost:5432/desafio\_integrador"

Instalação e inicialização

bash

cd backend

npm install

Execute as migrations para criar as tabelas no banco:

bash

npx prisma migrate dev

Inicie o servidor em modo desenvolvimento:

bash

npm run start:dev

A API estará disponível em http://localhost:3001.

&#x20;A documentação Swagger estará em http://localhost:3001/docs.

Scripts disponíveis

bash

npm run start        # produção

npm run start:dev    # desenvolvimento com hot-reload

npm run build        # compila para dist/

npm run test         # testes unitários

npm run test:e2e     # testes end-to-end

npm run test:cov     # cobertura de testes



3\. ML Service (FastAPI)

Instalação das dependências Python

bash

cd ml

pip install fastapi uvicorn scikit-learn pandas numpy openpyxl scipy

Treinamento do modelo

Antes de subir o serviço, é necessário gerar os arquivos modelo.pkl, scaler.pkl e colunas.pkl. Coloque o arquivo ecommerce\_churn.xlsx na pasta ml/ e execute:

bash

python train.py

Iniciando o serviço

bash

uvicorn main:app --reload --port 8000

O serviço estará disponível em http://localhost:8000.

Endpoints ML

Método

Rota

Descrição

GET

/

Status do serviço e informações do modelo

POST

/predict

Recebe dados de um cliente e retorna previsão de churn





4\. Frontend (Next.js)

bash

cd frontend

npm install

npm run dev

A aplicação estará disponível em http://localhost:3000.

Scripts disponíveis

bash

npm run dev      # desenvolvimento

npm run build    # build de produção

npm run start    # inicia o build de produção

npm run lint     # verifica o código com ESLint



Estrutura do Projeto

Desafio-Integrador-2026/

├── backend/                  # API REST (NestJS)

│   ├── prisma/

│   │   ├── schema.prisma     # Modelos do banco de dados

│   │   └── migrations/       # Histórico de migrações

│   └── src/

│       ├── clientes/         # CRUD de clientes

│       ├── produtos/         # CRUD de produtos

│       ├── categorias/       # CRUD de categorias

│       ├── pedidos/          # CRUD de pedidos

│       ├── relatorios/       # Geração de relatórios

│       └── ml/               # Integração com o serviço de ML

├── frontend/                 # Interface web (Next.js)

│   └── app/

│       ├── dashboard/        # Painel principal

│       ├── clientes/         # Gestão de clientes

│       ├── produtos/         # Gestão de produtos

│       ├── pedidos/          # Gestão de pedidos

│       ├── categorias/       # Gestão de categorias

│       ├── graficos/         # Visualizações analíticas

│       ├── relatorios/       # Relatórios

│       ├── churn/            # Análise de churn

│       ├── decisao/          # Suporte à decisão

│       └── exportacao/       # Exportação de dados

└── ml/                       # Serviço de Machine Learning (FastAPI)

&#x20;   ├── train.py              # Treinamento do modelo Random Forest

&#x20;   └── main.py               # API de predição



Modelo de Machine Learning

O modelo de churn utiliza um Random Forest Classifier treinado com as seguintes features:

Feature

Descrição

Tenure

Dias desde o primeiro pedido do cliente

OrderCount

Número total de pedidos realizados

DaySinceLastOrder

Dias desde o último pedido

CashbackAmount

Valor médio dos pedidos

Complain

Se o cliente possui pedidos cancelados (0 ou 1)



O modelo retorna a probabilidade de churn e classifica o risco em Baixo, Médio ou Alto.



Dependências Principais

Backend

@nestjs/common, @nestjs/core, @nestjs/platform-express — Framework NestJS

@prisma/client + prisma — ORM para PostgreSQL

@nestjs/swagger — Documentação automática da API

@nestjs/axios + axios — Comunicação HTTP com o serviço ML

class-validator + class-transformer — Validação de DTOs

Frontend

next 16 + react 19 — Framework web

tailwindcss 4 — Estilização

recharts — Gráficos e visualizações

lucide-react — Ícones

ML Service

fastapi + uvicorn — Servidor web Python

scikit-learn — Treinamento e inferência do modelo

pandas + numpy — Manipulação de dados

openpyxl + scipy — Leitura do dataset e tratamento estatístico






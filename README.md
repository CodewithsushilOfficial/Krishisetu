# KrishiSetu — AI-Powered Farm-to-Market Intelligence & Commerce Platform

**Problem Statement ID:** SIH26033  
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution (Department of Consumer Affairs)  
**Status:** Phase 0 — Project Foundation

---

## 1. Description

KrishiSetu is an integrated farm-to-market digital ecosystem connecting **Farmers, Farmer Producer Organizations (FPOs), Bulk Institutional Buyers, Retail Consumers, and Logistics Transporters**. The platform unifies digital agricultural commerce with AI intelligence for price forecasting, demand pooling, multi-objective matching, route optimization, and lot-level traceability.

---

## 2. System Architecture

The codebase is organized as a workspace with strict domain boundaries and dynamic modular architecture:

```text
KrishiSetu/
├── frontend/           # React 18 + Vite (Pure JavaScript, Tailwind CSS, Zustand)
├── backend/            # Node.js + Express (Modular Monolith, Prisma, Redis)
├── ai-services/        # Python 3.11+ + FastAPI (AI Predictive Microservices)
├── docs/               # Platform architecture & specifications
└── docker-compose.yml  # Local development infrastructure (Redis & DB)
```

- **Frontend:** Consumes `/api/v1` REST APIs. Never accesses internal databases or AI services directly.
- **Backend:** Central business logic layer, PostgreSQL transaction boundaries, Redis caching, and R2 object storage management.
- **AI Services:** Independent FastAPI microservice for algorithmic computations, accessed exclusively through the backend gateway.

---

## 3. Technology Stack

| Layer               | Technologies                                                                                                                             |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | React 18, Vite, JavaScript (ESM, No TypeScript), Tailwind CSS, React Router, TanStack Query, Zustand, Axios, Lucide React, Framer Motion |
| **Backend**         | Node.js (LTS), Express.js, JavaScript (ESM, No TypeScript), Prisma ORM, PostgreSQL (Supabase), Redis, Zod, Helmet, CORS                  |
| **AI Services**     | Python 3.11+, FastAPI, Pydantic, Uvicorn                                                                                                 |
| **Storage & Cache** | PostgreSQL (Supabase), Redis 7, Cloudflare R2 (S3-compatible)                                                                            |
| **Tooling**         | pnpm, ESLint, Prettier, EditorConfig, Docker                                                                                             |

---

## 4. Prerequisites & Requirements

- **Node.js**: `v20.x` or higher
- **pnpm**: `v9.x` or higher
- **Python**: `3.11` to `3.13`
- **Docker** (optional for local Redis): Docker Desktop / Docker Engine

---

## 5. Quickstart & Installation

### Step 1: Clone and Install Dependencies

```bash
# Install workspace dependencies (frontend, backend, root tooling)
pnpm install
```

### Step 2: Configure Environment Variables

```bash
# Copy root environment configuration
cp .env.example .env

# Backend environment configuration
cp backend/.env.example backend/.env

# Frontend environment configuration
cp frontend/.env.example frontend/.env

# AI Services environment configuration
cp ai-services/.env.example ai-services/.env
```

### Step 3: Set Up Python AI Virtual Environment

```bash
cd ai-services
python -m venv .venv

# Activate virtual environment:
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install AI dependencies:
pip install -r requirements.txt
cd ..
```

### Step 4: Generate Prisma Client

```bash
pnpm --filter backend prisma:generate
```

---

## 6. Running Locally

### Run All Services Concurrently

```bash
pnpm dev
```

### Run Individual Services

```bash
# Frontend (http://localhost:5173)
pnpm dev:frontend

# Backend API (http://localhost:5000)
pnpm dev:backend

# AI Microservices (http://localhost:8000)
pnpm dev:ai
```

---

## 7. Infrastructure Services (Docker)

To run Redis and local PostgreSQL fallback:

```bash
docker-compose up -d redis postgres
```

---

## 8. Health Checks & Diagnostics

| Service          | Endpoint                                          | Description                            |
| :--------------- | :------------------------------------------------ | :------------------------------------- |
| **Backend Core** | `GET http://localhost:5000/api/v1/health`         | Backend status, uptime, timestamp      |
| **Database**     | `GET http://localhost:5000/api/v1/health/db`      | Real PostgreSQL round-trip query check |
| **Redis**        | `GET http://localhost:5000/api/v1/health/redis`   | Real Redis ping diagnostic             |
| **Storage**      | `GET http://localhost:5000/api/v1/health/storage` | Cloudflare R2 configuration check      |
| **AI Services**  | `GET http://localhost:8000/health`                | FastAPI health & service status        |

---

## 9. Code Quality & Formatting

```bash
# Check code formatting
pnpm format:check

# Format all code files
pnpm format

# Lint verification
pnpm lint

# Build verification
pnpm build
```

---

## 10. Development Guidelines

KrishiSetu follows the **Permanent Dynamic Modular Architecture Rule**:

- **Build Only What Is Needed Now**: No speculative or empty folders (`farmer/`, `fpo/`, `orders/`, etc. are created only when that feature is actively implemented).
- **Pure JavaScript**: Strictly no TypeScript in frontend or backend.
- **Strict Layering**: `Route → Controller → Service → Repository → Prisma → PostgreSQL`.

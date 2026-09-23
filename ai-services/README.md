# KrishiSetu AI Services

Independent Python FastAPI service for KrishiSetu machine learning and optimization algorithms.

## Local Setup

```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate virtual environment
# Windows:
.venv\Scripts\activate
# Unix/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Run development server
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /health`: Platform health diagnostics
- `GET /docs`: Interactive Swagger API documentation

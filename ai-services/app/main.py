from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.health import router as health_router
from app.api.farmer_insights import router as insights_router
from app.config.settings import get_settings
from app.core.logging import logger

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"KrishiSetu AI Microservices starting on {settings.host}:{settings.port} (env: {settings.app_env})")
    yield
    logger.info("KrishiSetu AI Microservices shutting down cleanly")


app = FastAPI(
    title="KrishiSetu AI Intelligence Services",
    description="Independent predictive & optimization intelligence suite for KrishiSetu platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Health router at root and /api/v1
app.include_router(health_router)
app.include_router(health_router, prefix="/api/v1")

# Mount Farmer Intelligence insights router
app.include_router(insights_router)
app.include_router(insights_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)

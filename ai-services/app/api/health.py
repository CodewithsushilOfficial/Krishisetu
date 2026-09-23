from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {
        "success": True,
        "service": "KrishiSetu AI Services",
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

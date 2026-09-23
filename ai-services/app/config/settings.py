from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    app_env: str = Field(default="development", alias="APP_ENV")
    host: str = Field(default="0.0.0.0", alias="AI_SERVICE_HOST")
    port: int = Field(default=8000, alias="AI_SERVICE_PORT")
    backend_url: str = Field(default="http://localhost:5000/api/v1", alias="BACKEND_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

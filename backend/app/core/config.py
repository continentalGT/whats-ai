from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Workloads Demo API"
    version: str = "1.0.0"
    sentiment_model: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()

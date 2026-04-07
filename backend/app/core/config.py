from pathlib import Path
from pydantic_settings import BaseSettings

_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    app_name: str = "AI Workloads Demo API"
    version: str = "1.1.0"

    # HuggingFace models (sentiment analysis + vision - still local)
    sentiment_model: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    detection_model: str = "facebook/detr-resnet-50"
    classification_model: str = "microsoft/resnet-50"
    captioning_model: str = "Salesforce/blip-image-captioning-base"

    # Azure AI Foundry / Azure OpenAI (sentence similarity embeddings)
    azure_openai_endpoint: str = ""
    azure_openai_key: str = ""
    azure_openai_embedding_deployment: str = "text-embedding-3-small"
    azure_openai_chat_deployment: str = "gpt-4o-mini"

    # Azure AI Multi-Service Account (OCR, Vision, Language, Translator, etc.)
    azure_multiservice_endpoint: str = ""
    azure_multiservice_key: str = ""
    azure_multiservice_region: str = "eastus2"

    # Azure Speech Service (TTS)
    azure_speech_key: str = ""
    azure_speech_region: str = "eastus2"

    # Whisper (STT)
    whisper_model: str = "openai/whisper-base"

    # Gmail SMTP (contact form)
    smtp_email: str = ""
    smtp_app_password: str = ""

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Database (SQLite by default; override with DATABASE_URL for PostgreSQL)
    database_url: str = "sqlite:///./whats_ai.db"

    # JWT
    jwt_secret_key: str = "CHANGE_ME_use_a_long_random_secret_for_access_tokens_min_32_chars"
    jwt_refresh_secret_key: str = "CHANGE_ME_use_a_different_long_random_secret_for_refresh_tokens"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_seconds: int = 900        # 15 minutes
    jwt_refresh_token_expire_days: int = 7

    # Google OAuth
    google_client_id: str = ""   # from Google Cloud Console

    class Config:
        env_file = _ENV_FILE


settings = Settings()

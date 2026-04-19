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

    # Azure Storage (guest leads table)
    azure_storage_connection_string: str = ""

    # Gmail SMTP (contact form)
    smtp_email: str = ""
    smtp_app_password: str = ""

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = _ENV_FILE


settings = Settings()

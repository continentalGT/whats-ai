from pydantic import BaseModel


class SpeechTranscribeResponse(BaseModel):
    text: str
    model: str
    file_size_kb: float


class TextToSpeechRequest(BaseModel):
    text: str
    voice: str


class TextToSpeechResponse(BaseModel):
    audio_base64: str   # base64-encoded MP3
    voice: str
    char_count: int

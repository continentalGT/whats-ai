import base64
import tempfile
import os
import numpy as np
import soundfile as sf
from io import BytesIO
from transformers import pipeline
import requests as http_requests
from app.core.config import settings

_asr_pipeline = None

# ── STT: Whisper ─────────────────────────────────────────────

def get_asr_pipeline():
    global _asr_pipeline
    if _asr_pipeline is None:
        _asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model=settings.whisper_model,
        )
    return _asr_pipeline


def transcribe_audio(audio_bytes: bytes, content_type: str) -> dict:
    pipe = get_asr_pipeline()
    file_size_kb = round(len(audio_bytes) / 1024, 1)

    ext_map = {
        'audio/wav': '.wav', 'audio/wave': '.wav', 'audio/x-wav': '.wav',
        'audio/flac': '.flac', 'audio/x-flac': '.flac',
        'audio/ogg': '.ogg', 'audio/mpeg': '.mp3', 'audio/mp3': '.mp3',
        'audio/mp4': '.m4a', 'audio/m4a': '.m4a',
    }
    ext = ext_map.get(content_type, '.wav')

    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        # Load as numpy array for reliable cross-format support
        audio_array, sample_rate = sf.read(tmp_path, dtype='float32')
        if len(audio_array.shape) > 1:
            audio_array = audio_array.mean(axis=1)  # stereo → mono
        result = pipe({"array": audio_array, "sampling_rate": sample_rate})
    finally:
        os.unlink(tmp_path)

    return {
        "text": result["text"].strip(),
        "model": settings.whisper_model,
        "file_size_kb": file_size_kb,
    }


# ── TTS: Azure Neural ─────────────────────────────────────────

_TTS_ENDPOINT = "https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"

_SSML_TEMPLATE = (
    "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{lang}'>"
    "<voice name='{voice}'>{text}</voice>"
    "</speak>"
)


def text_to_speech(text: str, voice: str) -> dict:
    # Extract language code from voice name: "en-US-JennyNeural" → "en-US"
    lang_code = "-".join(voice.split("-")[:2])
    ssml = _SSML_TEMPLATE.format(lang=lang_code, voice=voice, text=text)

    url = _TTS_ENDPOINT.format(region=settings.azure_speech_region)
    headers = {
        "Ocp-Apim-Subscription-Key": settings.azure_speech_key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        "User-Agent": "AIDemoApp",
    }

    response = http_requests.post(url, headers=headers, data=ssml.encode("utf-8"), timeout=15)
    response.raise_for_status()

    audio_b64 = base64.b64encode(response.content).decode("utf-8")

    return {
        "audio_base64": audio_b64,
        "voice": voice,
        "char_count": len(text),
    }

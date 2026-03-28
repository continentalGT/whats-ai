from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.schemas.speech import SpeechTranscribeResponse, TextToSpeechRequest, TextToSpeechResponse
from app.services.speech_service import transcribe_audio, text_to_speech

router = APIRouter()

_ALLOWED_AUDIO_TYPES = {
    'audio/wav', 'audio/wave', 'audio/x-wav',
    'audio/flac', 'audio/x-flac',
    'audio/ogg',
    'audio/mpeg', 'audio/mp3',
    'audio/mp4', 'audio/m4a',
}


@router.post("/transcribe", response_model=SpeechTranscribeResponse)
async def speech_to_text(file: UploadFile = File(...)):
    if file.content_type not in _ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=400, detail="File must be an audio file (WAV, FLAC, OGG, MP3)")
    contents = await file.read()
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Audio file must be under 25 MB")
    try:
        result = transcribe_audio(contents, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    return SpeechTranscribeResponse(**result)


@router.post("/tts", response_model=TextToSpeechResponse)
def tts(request: TextToSpeechRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    if len(text) > 300:
        raise HTTPException(status_code=400, detail=f"Text exceeds 300 character limit ({len(text)} chars)")
    if not request.voice.strip():
        raise HTTPException(status_code=400, detail="Voice must be selected")
    try:
        result = text_to_speech(text, request.voice)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
    return TextToSpeechResponse(**result)

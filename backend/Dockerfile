FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models at build time (online mode)
RUN python -c "\
from transformers import pipeline; \
pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment-latest'); \
print('Sentiment model downloaded')"

RUN python -c "\
from transformers import pipeline; \
pipeline('object-detection', model='facebook/detr-resnet-50'); \
print('DETR model downloaded')"

RUN python -c "\
from transformers import BlipProcessor, BlipForConditionalGeneration; \
BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base'); \
BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base'); \
print('BLIP captioning model downloaded')"

# After downloading, lock to offline mode so runtime never calls HuggingFace
ENV TRANSFORMERS_OFFLINE=1
ENV HF_DATASETS_OFFLINE=1

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

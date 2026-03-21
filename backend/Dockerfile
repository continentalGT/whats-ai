FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models at build time so runtime needs no internet access
# and first request is instant
RUN python -c "\
from transformers import pipeline; \
pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment-latest'); \
print('Sentiment model downloaded')"

RUN python -c "\
from transformers import pipeline; \
pipeline('object-detection', model='facebook/detr-resnet-50'); \
print('DETR model downloaded')"

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

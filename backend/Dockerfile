FROM python:3.11-slim

WORKDIR /app

# Install PyTorch CPU-only first (from PyTorch's own index — much smaller than CUDA builds)
RUN pip install --no-cache-dir \
    torch==2.6.0 \
    torchvision==0.21.0 \
    --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models at build time (online mode)
COPY preload_models.py .
RUN python preload_models.py

# Lock HuggingFace to offline mode so models are served from cache at runtime
ENV TRANSFORMERS_OFFLINE=1
ENV HF_DATASETS_OFFLINE=1

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

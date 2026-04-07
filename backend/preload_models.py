from transformers import pipeline
from huggingface_hub import snapshot_download

pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment-latest')
print('Sentiment model downloaded')

pipeline('object-detection', model='facebook/detr-resnet-50')
print('DETR model downloaded')

snapshot_download(repo_id='Salesforce/blip-image-captioning-base')
print('BLIP captioning model downloaded')

pipeline('image-classification', model='microsoft/resnet-50')
print('ResNet-50 classification model downloaded')

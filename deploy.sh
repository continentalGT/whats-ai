#!/bin/bash
# Deploy AI Workloads Demo to Azure Container Apps
# Usage: ./deploy.sh
# Prerequisites: az CLI logged in, Docker running, .env file with secrets
set -e

# ── Config ────────────────────────────────────────────────────────────────────
RESOURCE_GROUP="whats-ai"
LOCATION="eastus2"
ACR_NAME="whatsairegistry"
ENVIRONMENT="whatsai-env"
BACKEND_APP="whatsai-backend"
FRONTEND_APP="whatsai-frontend"

# Load secrets from .env (expects AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY)
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$AZURE_OPENAI_ENDPOINT" ] || [ -z "$AZURE_OPENAI_KEY" ]; then
  echo "ERROR: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY must be set in .env"
  exit 1
fi

# ── Resource group ────────────────────────────────────────────────────────────
echo ">> Ensuring resource group exists..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# ── Azure Container Registry ──────────────────────────────────────────────────
echo ">> Ensuring ACR exists..."
az acr create \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku Basic \
  --admin-enabled true 2>/dev/null || echo "ACR already exists, skipping."

ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

echo ">> Logging in to ACR..."
az acr login --name $ACR_NAME

# ── Build & push images ───────────────────────────────────────────────────────
echo ">> Building backend image (this may take a while — models are baked in)..."
docker build -t $ACR_LOGIN_SERVER/$BACKEND_APP:latest ./backend
docker push $ACR_LOGIN_SERVER/$BACKEND_APP:latest

echo ">> Building frontend image..."
docker build -t $ACR_LOGIN_SERVER/$FRONTEND_APP:latest ./frontend
docker push $ACR_LOGIN_SERVER/$FRONTEND_APP:latest

# ── Container Apps environment ────────────────────────────────────────────────
echo ">> Creating Container Apps environment..."
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# ── Backend Container App (internal ingress, min-replicas=1) ──────────────────
# min-replicas=1 avoids cold starts when loading large HuggingFace models
echo ">> Deploying backend..."
az containerapp create \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/$BACKEND_APP:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 8000 \
  --ingress internal \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 2.0 \
  --memory 4.0Gi \
  --secrets \
    azure-openai-endpoint="$AZURE_OPENAI_ENDPOINT" \
    azure-openai-key="$AZURE_OPENAI_KEY" \
  --env-vars \
    AZURE_OPENAI_ENDPOINT=secretref:azure-openai-endpoint \
    AZURE_OPENAI_KEY=secretref:azure-openai-key \
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small

# ── Frontend Container App (external ingress) ─────────────────────────────────
echo ">> Deploying frontend..."
az containerapp create \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_LOGIN_SERVER/$FRONTEND_APP:latest \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 80 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 2 \
  --cpu 0.25 \
  --memory 0.5Gi \
  --env-vars \
    BACKEND_URL=http://$BACKEND_APP

# ── Done ──────────────────────────────────────────────────────────────────────
FRONTEND_URL=$(az containerapp show \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo ""
echo "Deployment complete!"
echo "  Frontend: https://$FRONTEND_URL"
echo ""
echo "To update after code changes:"
echo "  docker build -t $ACR_LOGIN_SERVER/$BACKEND_APP:latest ./backend && docker push $ACR_LOGIN_SERVER/$BACKEND_APP:latest"
echo "  az containerapp update --name $BACKEND_APP --resource-group $RESOURCE_GROUP --image $ACR_LOGIN_SERVER/$BACKEND_APP:latest"

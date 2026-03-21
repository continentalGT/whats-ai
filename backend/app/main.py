from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import nlp, vision
from app.core.config import settings

app = FastAPI(title=settings.app_name, version=settings.version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# routers
app.include_router(nlp.router, prefix="/api/nlp", tags=["NLP"])
app.include_router(vision.router, prefix="/api/vision", tags=["Vision"])


@app.get("/")
def root():
    return {"message": f"{settings.app_name} is running"}

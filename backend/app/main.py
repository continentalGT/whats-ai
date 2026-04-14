from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import nlp, vision, search, document, misc, train, basics_cv, speech
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
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(document.router, prefix="/api/document", tags=["Document"])
app.include_router(misc.router, prefix="/api/misc", tags=["Misc"])
app.include_router(train.router, prefix="/api/train", tags=["Train"])
app.include_router(basics_cv.router, prefix="/api/basics-cv", tags=["Basics CV"])
app.include_router(speech.router, prefix="/api/speech", tags=["Speech"])


@app.get("/")
def root():
    return {"message": f"{settings.app_name} is running"}

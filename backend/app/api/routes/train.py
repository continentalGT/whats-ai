import json
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.train_service import train_model, predict

router = APIRouter()


@router.post("/train")
async def train(
    class_names: str = Form(...),       # JSON: ["cat","dog"]
    cnn_filters: str = Form(...),       # JSON: [32, 64]
    ann_neurons: str = Form(...),       # JSON: [128]
    epochs: int = Form(...),
    lr: float = Form(0.001),
    files: List[UploadFile] = File(...),
    file_labels: str = Form(...),       # JSON: [0,0,0,1,1,1] matching files
):
    try:
        names = json.loads(class_names)
        filters = json.loads(cnn_filters)
        neurons = json.loads(ann_neurons)
        labels = json.loads(file_labels)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON in form fields.")

    if len(names) < 2 or len(names) > 3:
        raise HTTPException(status_code=400, detail="Provide 2 or 3 classes.")
    if len(files) != len(labels):
        raise HTTPException(status_code=400, detail="files and file_labels length mismatch.")
    if not (1 <= len(filters) <= 4):
        raise HTTPException(status_code=400, detail="CNN layers must be 1–4.")
    if not (1 <= epochs <= 50):
        raise HTTPException(status_code=400, detail="Epochs must be 1–50.")

    images_per_class = [[] for _ in names]
    for f, label in zip(files, labels):
        if not f.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"{f.filename} is not an image.")
        images_per_class[label].append(await f.read())

    for i, imgs in enumerate(images_per_class):
        if len(imgs) < 2:
            raise HTTPException(status_code=400, detail=f"Class '{names[i]}' needs at least 2 images.")

    try:
        session_id, history, total_params = train_model(
            images_per_class, names, filters, neurons, epochs, lr
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

    return {
        "session_id": session_id,
        "history": history,
        "total_params": total_params,
        "class_names": names,
        "architecture": {"cnn_filters": filters, "ann_neurons": neurons},
    }


@router.post("/predict")
async def test_predict(
    session_id: str = Form(...),
    file: UploadFile = File(...),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    image_bytes = await file.read()
    try:
        results = predict(session_id, image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    return {"predictions": results, "session_id": session_id}

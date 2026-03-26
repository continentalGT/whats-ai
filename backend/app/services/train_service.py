import io
import uuid
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image

IMG_SIZE = 64
_sessions: dict = {}  # session_id -> {model, class_names, transform}


class _InMemoryDataset(Dataset):
    def __init__(self, images: list, labels: list, transform):
        self.images = images
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img = Image.open(io.BytesIO(self.images[idx])).convert("RGB")
        return self.transform(img), self.labels[idx]


class CustomCNN(nn.Module):
    def __init__(self, num_classes: int, cnn_filters: list, ann_neurons: list):
        super().__init__()
        conv_blocks = []
        in_ch = 3
        for f in cnn_filters:
            conv_blocks += [
                nn.Conv2d(in_ch, f, kernel_size=3, padding=1),
                nn.BatchNorm2d(f),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2),
            ]
            in_ch = f
        self.conv = nn.Sequential(*conv_blocks)

        spatial = IMG_SIZE // (2 ** len(cnn_filters))
        fc_in = in_ch * spatial * spatial

        fc_blocks = []
        prev = fc_in
        for n in ann_neurons:
            fc_blocks += [nn.Linear(prev, n), nn.ReLU(inplace=True), nn.Dropout(0.4)]
            prev = n
        fc_blocks.append(nn.Linear(prev, num_classes))
        self.fc = nn.Sequential(*fc_blocks)

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)


def train_model(
    images_per_class: list,   # list of lists of bytes
    class_names: list,
    cnn_filters: list,
    ann_neurons: list,
    epochs: int,
    lr: float = 0.001,
) -> tuple:
    train_tf = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize([0.5] * 3, [0.5] * 3),
    ])

    all_images, all_labels = [], []
    for label_idx, imgs in enumerate(images_per_class):
        for img_bytes in imgs:
            all_images.append(img_bytes)
            all_labels.append(label_idx)

    dataset = _InMemoryDataset(all_images, all_labels, train_tf)
    batch = min(8, len(dataset))
    loader = DataLoader(dataset, batch_size=batch, shuffle=True)

    model = CustomCNN(len(class_names), cnn_filters, ann_neurons)
    optimizer = optim.Adam(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()

    history = []
    model.train()
    for epoch in range(epochs):
        total_loss, correct, total = 0.0, 0, 0
        for imgs, labels in loader:
            optimizer.zero_grad()
            out = model(imgs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            preds = out.argmax(1)
            correct += preds.eq(labels).sum().item()
            total += labels.size(0)
        history.append({
            "epoch": epoch + 1,
            "loss": round(total_loss / len(loader), 4),
            "accuracy": round(correct / total * 100, 1),
        })

    session_id = str(uuid.uuid4())[:8]
    test_tf = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize([0.5] * 3, [0.5] * 3),
    ])
    _sessions[session_id] = {
        "model": model,
        "class_names": class_names,
        "transform": test_tf,
    }

    total_params = sum(p.numel() for p in model.parameters())
    return session_id, history, total_params


def predict(session_id: str, image_bytes: bytes) -> list:
    if session_id not in _sessions:
        raise ValueError("Session expired or not found. Please train again.")
    s = _sessions[session_id]
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = s["transform"](img).unsqueeze(0)
    s["model"].eval()
    with torch.no_grad():
        probs = torch.softmax(s["model"](tensor), dim=1)[0]
    return sorted(
        [{"class_name": s["class_names"][i], "confidence": round(probs[i].item(), 4)}
         for i in range(len(s["class_names"]))],
        key=lambda x: x["confidence"], reverse=True,
    )

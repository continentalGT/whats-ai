from pydantic import BaseModel
from datetime import datetime


class DemoResult(BaseModel):
    demo: str
    model: str
    input: str
    output: dict
    timestamp: datetime = None

    def model_post_init(self, __context):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()

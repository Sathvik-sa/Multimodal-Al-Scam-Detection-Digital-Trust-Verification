from pydantic import BaseModel
from typing import List, Optional

class TextPayload(BaseModel):
    text: str

class ModuleResult(BaseModel):
    module: Optional[str] = None
    score: Optional[int] = None
    status: Optional[str] = None
    confidence: Optional[float] = None
    reasons: Optional[List[str]] = None

class TrustScorePayload(BaseModel):
    voice: Optional[ModuleResult] = None
    video: Optional[ModuleResult] = None
    image: Optional[ModuleResult] = None
    text: Optional[ModuleResult] = None

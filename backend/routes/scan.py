from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from services.ml_service import ml_service

router = APIRouter()

class TextRequest(BaseModel):
    text: str

class TrustScoreRequest(BaseModel):
    results: dict

@router.post("/voice")
async def analyze_voice(file: UploadFile = File(...)):
    return ml_service.analyze_voice()

@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    return ml_service.analyze_video()

@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    return ml_service.analyze_image()

@router.post("/text")
async def analyze_text_endpoint(req: TextRequest):
    return ml_service.analyze_text(req.text)

@router.post("/trust-score")
async def calculate_trust_score(req: TrustScoreRequest):
    results = req.results
    weights = {'voice': 0.35, 'video': 0.30, 'image': 0.20, 'text': 0.15}
    total_score = 0
    total_weight = 0

    for key, res in results.items():
        if res and key in weights:
            total_score += res['score'] * weights[key]
            total_weight += weights[key]

    if total_weight == 0:
        overall_score = 100
    else:
        overall_score = round(total_score / total_weight)

    if overall_score >= 80:
        risk = "Safe"
        rec = "Content appears authentic. Safe to proceed."
    elif overall_score >= 60:
        risk = "Medium"
        rec = "Some anomalies detected. Proceed with caution."
    elif overall_score >= 40:
        risk = "High"
        rec = "High risk of manipulation. Do not share sensitive info."
    else:
        risk = "Critical"
        rec = "CRITICAL WARNING: Highly likely to be a scam or deepfake. DO NOT ACT ON THIS."

    # Gather evidence and confidence
    evidence = []
    confidence_list = []
    for res in results.values():
        if res:
            if "reasons" in res:
                evidence.extend(res["reasons"])
            if "confidence" in res:
                confidence_list.append(res["confidence"])
                
    avg_confidence = sum(confidence_list) / len(confidence_list) if confidence_list else 0.9

    import datetime
    return {
        "trust_score": overall_score,
        "risk_level": risk,
        "confidence": round(avg_confidence, 2),
        "evidence": evidence,
        "recommendation": rec,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

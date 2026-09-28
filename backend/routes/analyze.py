from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import datetime
from schemas.api_schemas import TextPayload, TrustScorePayload
from services import ml_service

router = APIRouter()

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

def validate_file(file: UploadFile, allowed_types: List[str]):
    if not file.filename:
        raise HTTPException(422, "No file uploaded")
    if file.size == 0:
        raise HTTPException(422, "File is empty (0 bytes). Please upload a valid file.")
    if file.content_type and not any(file.content_type.startswith(t) for t in allowed_types):
        raise HTTPException(422, f"Invalid file type: {file.content_type}. Expected: {allowed_types}")

@router.post("/voice")
async def analyze_voice(file: UploadFile = File(...)):
    validate_file(file, ["audio/"])
    contents = await file.read()
    return ml_service.analyze_voice_ml(contents)

@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    validate_file(file, ["video/"])
    contents = await file.read()
    return ml_service.analyze_video_ml(contents)

@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    validate_file(file, ["image/"])
    contents = await file.read()
    return ml_service.analyze_image_ml(contents)

@router.post("/text")
async def analyze_text(payload: TextPayload):
    if not payload.text.strip():
        raise HTTPException(422, "Text cannot be empty")
    return ml_service.analyze_text_ml(payload.text)

WEIGHTS = {"voice": 0.35, "video": 0.30, "image": 0.20, "text": 0.15}

@router.post("/trust-score")
async def calculate_trust_score(payload: TrustScorePayload):
    total_weight = 0.0
    weighted_sum = 0.0

    for mod, w in WEIGHTS.items():
        val = getattr(payload, mod)
        if val and val.score is not None:
            weighted_sum += val.score * w
            total_weight += w

    if total_weight == 0:
        return {
            "overall_score": 0,
            "risk_level": "Unknown",
            "recommendation": "Upload at least one media file to generate a Trust Score.",
            "timestamp": datetime.datetime.now().strftime("%d %b %Y, %I:%M %p"),
        }

    final_score = round(weighted_sum / total_weight)

    if final_score >= 80:
        risk = "Safe"
        rec = "This interaction appears safe. Normal patterns detected across all modules."
    elif final_score >= 60:
        risk = "Medium"
        rec = "Some anomalies detected. Verify the sender's identity before acting."
    elif final_score >= 40:
        risk = "High"
        rec = "Multiple suspicious indicators detected. Proceed with extreme caution."
    else:
        risk = "Critical"
        rec = "DO NOT PROCEED. High probability of scam/deepfake. Verify through a trusted, alternative channel immediately."

    return {
        "overall_score": final_score,
        "risk_level": risk,
        "recommendation": rec,
        "timestamp": datetime.datetime.now().strftime("%d %b %Y, %I:%M %p"),
    }

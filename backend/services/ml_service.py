import time
import random
from typing import Dict, Any

class MLService:
    def __init__(self):
        self.models_loaded = False
        self.load_models()

    def load_models(self):
        # Simulated fast loading for hackathon
        self.models_loaded = True

    def analyze_voice(self) -> Dict[str, Any]:
        time.sleep(0.5)
        return {
            "score": random.randint(15, 35),
            "status": "Fake",
            "confidence": 0.94,
            "reasons": ["AI vocoder artifacts detected", "Unnatural pitch variations"]
        }

    def analyze_video(self) -> Dict[str, Any]:
        time.sleep(0.5)
        return {
            "score": random.randint(12, 30),
            "status": "Fake",
            "confidence": 0.91,
            "reasons": ["Facial boundary blending detected", "Unnatural blinking rate"]
        }

    def analyze_image(self) -> Dict[str, Any]:
        time.sleep(0.5)
        return {
            "score": random.randint(20, 45),
            "status": "Fake",
            "confidence": 0.88,
            "reasons": ["GAN upscaling patterns found", "Inconsistent lighting"]
        }

    def analyze_text(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        score = 85
        reasons = []

        scam_keywords = ["urgent", "arrest", "blocked", "cbi", "otp", "win", "prize", "job", "offer"]
        for kw in scam_keywords:
            if kw in text_lower:
                score -= 15
                reasons.append(f"Suspicious keyword found: '{kw}'")

        if "₹" in text or "rs" in text_lower or "$" in text:
            score -= 20
            reasons.append("Financial demand detected")

        score = max(5, score)
        status = "Safe" if score >= 70 else "Fake"
        
        if status == "Safe" and not reasons:
            reasons.append("No suspicious patterns detected")

        return {
            "score": score,
            "status": status,
            "confidence": 0.95,
            "reasons": reasons
        }

ml_service = MLService()

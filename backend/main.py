from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import scan, health

app = FastAPI(title="ShadowGuard AI", version="2.0.0")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(scan.router)

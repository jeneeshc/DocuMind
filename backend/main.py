from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="DocuMind API",
    description="Enterprise-Grade Hybrid AI Document Orchestrator",
    version="1.0.0"
)

from app.api import router as api_router
from app.routers.testing import router as testing_router

app.include_router(api_router, prefix="/api/v1")
app.include_router(testing_router, prefix="/api/v1/testing")

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to DocuMind API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "fal": "configured" if os.getenv("FAL_KEY") else "missing_key",
            "azure": "configured" if os.getenv("AZURE_FORM_RECOGNIZER_KEY") else "missing_key"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

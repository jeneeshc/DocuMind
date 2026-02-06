from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from backend.app.models.schemas import *
from backend.app.streams.stream_a import stream_a
from backend.app.streams.stream_b import stream_b
from backend.app.streams.stream_c import stream_c

router = APIRouter()

@router.post("/process/stream-a", response_model=ProcessResponse)
async def process_stream_a(
    instruction: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Stream A: Logic Synthesis for Structured Data
    """
    try:
        content = await file.read()
        result = await stream_a.process(content, file.filename, instruction)
        
        if result["status"] == "error":
            return ProcessResponse(
                status="error", 
                message=result["message"], 
                error=result.get("generated_code") # return code for debugging if error
            )
            
        return ProcessResponse(
            status="success",
            message="Data transformed successfully",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/stream-b", response_model=ProcessResponse)
async def process_stream_b(
    file: UploadFile = File(...)
):
    """
    Stream B: Self-Healing Form Processing
    """
    try:
        content = await file.read()
        result = await stream_b.process(content, file.filename)
        
        if result["status"] == "error":
            return ProcessResponse(status="error", message=result["message"])
            
        return ProcessResponse(
            status="success",
            message="Form processed with self-healing",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/stream-c", response_model=ProcessResponse)
async def process_stream_c(
    query: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Stream C: Semantic Pruning for Unstructured Docs
    """
    try:
        content = await file.read()
        result = await stream_c.process(content, file.filename, query)
        
        return ProcessResponse(
            status="success",
            message="Query answered from document context",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

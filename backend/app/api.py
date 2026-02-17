from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import Optional
import os
from app.models.schemas import ProcessResponse
from app.core.gatekeeper import gatekeeper
from app.streams.stream_a import stream_a
from app.streams.stream_b import stream_b
from app.streams.stream_c import stream_c
from app.streams.stream_d import stream_d

router = APIRouter()

@router.post("/process/orchestrate", response_model=ProcessResponse)
async def orchestrate(
    file: UploadFile = File(...),
    instruction: Optional[str] = Form(None),
    query: Optional[str] = Form(None)
):
    """
    Intelligent Orchestrator: Autonomous routing via Cascade Classification.
    """
    try:
        content = await file.read()
        stream_type = await gatekeeper.route(content, file.filename)
        
        if stream_type == "A":
            result = await stream_a.process(content, file.filename, instruction or "Summarize data")
        elif stream_type == "B":
            result = await stream_b.process(content, file.filename)
        elif stream_type == "C":
            result = await stream_c.process(content, file.filename, query)
        else:
            result = await stream_d.process(content, file.filename, query or "What is this document?")
            
        return ProcessResponse(
            status="success",
            message=f"Automatically routed to Stream {stream_type}",
            data=result,
            stream_used=stream_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/stream-a", response_model=ProcessResponse)
async def process_stream_a(
    instruction: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        result = await stream_a.process(content, file.filename, instruction)
        return ProcessResponse(status="success", message="Stream A processing complete", data=result, stream_used="A")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/process/stream-b", response_model=ProcessResponse)
async def process_stream_b(
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        result = await stream_b.process(content, file.filename)
        return ProcessResponse(status="success", message="Stream B processing complete", data=result, stream_used="B")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/stream-c", response_model=ProcessResponse)
async def process_stream_c(
    file: UploadFile = File(...),
    query: Optional[str] = Form(None)
):
    try:
        content = await file.read()
        result = await stream_c.process(content, file.filename, query)
        return ProcessResponse(status="success", message="Stream C processing complete", data=result, stream_used="C")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process/stream-d", response_model=ProcessResponse)
async def process_stream_d(
    query: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        result = await stream_d.process(content, file.filename, query)
        return ProcessResponse(status="success", message="Stream D processing complete", data=result, stream_used="D")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{result_id}")
async def download_result(result_id: str):
    """
    Serves the transformed CSV file for download.
    """
    # Note: results are stored in app/streams/results relative to stream_a.py
    # but api.py is in app/
    file_path = os.path.join(os.path.dirname(__file__), "streams", "results", f"{result_id}.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Result not found or expired.")
    
    return FileResponse(
        path=file_path,
        filename=f"transformed_data_{result_id[:8]}.csv",
        media_type="text/csv"
    )
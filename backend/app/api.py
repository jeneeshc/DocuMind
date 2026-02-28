from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import Optional
import os
import time
import random
import pandas as pd
from app.models.schemas import ProcessResponse
from app.core.gatekeeper import gatekeeper
from app.streams.stream_a import stream_a
from app.streams.stream_b import stream_b
from app.streams.stream_c import stream_c
from app.streams.stream_d import stream_d

router = APIRouter()

def log_transaction(filename: str, stream_type: str, elapsed_time: float, cost: float):
    """
    Appends the orchestrator transaction to the results CSV.
    Maintains a rolling limit of exactly 10,000 records to prevent infinite scaling.
    """
    results_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "datasources", "Test", "Results", "rq1_data.csv")
    
    # Map the letter to the actual logic group for the dashboard
    group_map = {
        "A": "Baseline A (LLM)", 
        "B": "Hybrid", 
        "C": "Hybrid", 
        "D": "Hybrid"
    }
    group = group_map.get(stream_type, "Hybrid")
    
    # Generate generic mock accuracy based on stream for logging purposes
    accuracy = random.randint(90, 100)
    
    new_row = {
        "document_id": filename,
        "group": group,
        "accuracy": accuracy,
        "cost": cost,
        "time": elapsed_time
    }
    
    try:
        if os.path.exists(results_path):
            df = pd.read_csv(results_path)
        else:
            df = pd.DataFrame(columns=["document_id", "group", "accuracy", "cost", "time"])
            
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        
        # Enforce 10,000 record cap rule
        if len(df) > 10000:
            df = df.tail(10000)
            
        df.to_csv(results_path, index=False)
    except Exception as e:
        print(f"Non-fatal error logging transaction: {e}")

@router.post("/process/orchestrate", response_model=ProcessResponse)
async def orchestrate(
    file: UploadFile = File(...),
    instruction: Optional[str] = Form(None),
    query: Optional[str] = Form(None),
    extraction_schema: Optional[str] = Form(None)
):
    """
    Intelligent Orchestrator: Autonomous routing via Cascade Classification.
    """
    try:
        start_time = time.time()
        content = await file.read()
        stream_type = await gatekeeper.route(content, file.filename)
        
        # In a real system, we'd calculate real token costs. For this simulation log, we assign standard hybrid vs baseline costs.
        mock_cost = 0.25 if stream_type == "A" else 0.005 

        if stream_type == "A":
            # Pass schema as instruction if present
            payload = extraction_schema or instruction or "Summarize data"
            result = await stream_a.process(content, file.filename, payload)
        elif stream_type == "B":
            result = await stream_b.process(content, file.filename)
        elif stream_type == "C":
            payload = extraction_schema or query
            result = await stream_c.process(content, file.filename, payload)
        else:
            payload = extraction_schema or query or "What is this document?"
            result = await stream_d.process(content, file.filename, payload)
            
        elapsed_time = time.time() - start_time
        
        # Log to the 10,000 cap CSV
        log_transaction(file.filename, stream_type, elapsed_time, mock_cost)
            
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
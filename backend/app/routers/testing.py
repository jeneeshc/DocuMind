from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import List
from app.models.testing import TestRequest, TestResultSummary
from app.services.statistics import statistics_service

router = APIRouter()

@router.post("/run", response_model=TestResultSummary)
async def run_test(request: TestRequest):
    """
    Executes a statistical test (RQ1, RQ2, RQ3, RQ4, RQ5).
    """
    try:
        valid_types = ["RQ1", "RQ2", "RQ3", "RQ4", "RQ5"]
        if request.test_type not in valid_types:
             raise HTTPException(status_code=400, detail=f"Invalid test type. Must be one of {valid_types}.")

        result = await statistics_service.run_test(
            test_type=request.test_type, 
            sample_size=request.sample_size,
            mock=request.mock
        )
        
        # Manually serialize to avoid FastAPI/Uvicorn crash on deep nested models or NaNs
        res_dict = result.dict()
        
        # Sanitize NaN
        import math
        def sanitize(obj):
            if isinstance(obj, float):
                if math.isnan(obj) or math.isinf(obj):
                    return None
            if isinstance(obj, dict):
                return {k: sanitize(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [sanitize(v) for v in obj]
            return obj
            
        res_dict = sanitize(res_dict)
        
        # Use json.dumps to ensure strict JSON compatibility (handles datetimes via default=str)
        import json
        json_str = json.dumps(res_dict, default=str)
        return json.loads(json_str)

    except Exception as e:
        import traceback
        traceback.print_exc() # Print to server logs
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[TestResultSummary])
async def get_test_history():
    """
    Retrieves the history of all run tests.
    """
    try:
        raw_history = statistics_service.get_history()
        
        # We need to sanitize the history as well because it might contain NaN or Inf values
        # stored previously or generated during retrieval.
        
        # Convert to dicts first
        history_dicts = [h.dict() for h in raw_history]
        
        # Reuse sanitization logic if possible, or redefine it here since it's small
        import math
        def sanitize(obj):
            if isinstance(obj, float):
                if math.isnan(obj) or math.isinf(obj):
                    return None
            if isinstance(obj, dict):
                return {k: sanitize(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [sanitize(v) for v in obj]
            return obj
            
        sanitized_history = sanitize(history_dicts)
        
        # Use json.dumps for strict JSON compatibility (datetimes)
        import json
        json_str = json.dumps(sanitized_history, default=str)
        return json.loads(json_str)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/export/{test_id}")
async def export_test(test_id: str):
    """
    Exports the test results as an Excel file.
    """
    try:
        buffer = statistics_service.export_test_results(test_id)
        if not buffer:
            raise HTTPException(status_code=404, detail="Test not found")
            
        headers = {
            'Content-Disposition': f'attachment; filename="test_results_{test_id}.xlsx"'
        }
        
        return StreamingResponse(
            buffer, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
            headers=headers
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

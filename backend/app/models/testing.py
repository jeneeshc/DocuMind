from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class TestRequest(BaseModel):
    test_type: str  # "RQ1", "RQ2", "RQ3", "RQ4"
    sample_size: int = 100
    mock: bool = True # For now, default to mock data to simulate the "Test" environment

class DetailedTestResult(BaseModel):
    sample_id: str
    input_size_bytes: Optional[int] = None
    processing_time_ms: Optional[float] = None
    cost_usd: Optional[float] = None
    accuracy_score: Optional[float] = None
    token_usage: Optional[int] = None
    flagged_error: Optional[bool] = None
    domain: Optional[str] = None # For RQ4
    stream_used: str
    
    # New fields for Stream A verification
    instruction: Optional[str] = None
    generated_code: Optional[str] = None
    execution_success: Optional[bool] = None
    filename: Optional[str] = None

class TestResultSummary(BaseModel):
    test_id: str
    test_type: str
    timestamp: datetime
    sample_size: int
    
    # Statistical Outcomes
    p_value: Optional[float] = None
    stat_statistic: Optional[float] = None
    significant: Optional[bool] = None
    effect_size: Optional[float] = None
    
    # Aggregated Metrics (Averages)
    avg_processing_time: Optional[float] = None
    avg_cost: Optional[float] = None
    avg_accuracy: Optional[float] = None
    avg_token_usage: Optional[int] = None
    f2_score: Optional[float] = None # For RQ3
    
    # Raw Data for Visualization (Optional, or fetched separately)
    details: List[DetailedTestResult] = []

class HistoricalTestResult(BaseModel):
    test_id: str
    timestamp: str
    test_type: str
    summary_metric: str # e.g. "p=0.04, d=0.5"
    result: str # "Significant" or "Not Significant"

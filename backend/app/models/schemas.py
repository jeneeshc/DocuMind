from pydantic import BaseModel
from typing import Optional, List, Any

class ProcessRequest(BaseModel):
    instruction: Optional[str] = None
    stream_type: str  # "A", "B", or "C"

class ProcessResponse(BaseModel):
    status: str
    message: str
    data: Optional[Any] = None
    error: Optional[str] = None

class StreamARequest(BaseModel):
    instruction: str
    filename: str

class StreamBRequest(BaseModel):
    filename: str
    force_repair: bool = False

class StreamCRequest(BaseModel):
    query: str
    filename: str

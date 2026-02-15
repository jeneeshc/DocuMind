from pydantic import BaseModel
from typing import Optional, List, Any

class ProcessRequest(BaseModel):
    instruction: Optional[str] = None
    stream_type: str  # "A", "B", "C", or "D"
    autonomous: bool = False

class ProcessResponse(BaseModel):
    status: str
    message: str
    data: Optional[Any] = None
    error: Optional[str] = None
    stream_used: Optional[str] = None

class StreamARequest(BaseModel):
    instruction: str
    filename: str

class StreamBRequest(BaseModel):
    filename: str
    force_repair: bool = False

class StreamCRequest(BaseModel):
    filename: str
    query: Optional[str] = None

class StreamDRequest(BaseModel):
    query: str
    filename: str

import os
import json
from typing import Tuple, Optional
from app.models.schemas import *
from app.streams.stream_a import stream_a
from app.streams.stream_b import stream_b
from app.streams.stream_c import stream_c
from app.streams.stream_d import stream_d

class Gatekeeper:
    """
    Cascade Classification framework to optimize routing and minimize cost.
    """
    
    @staticmethod
    def _extract_pdf_text(file_content: bytes, max_chars: int = 3000) -> str:
        """
        Uses PyMuPDF to extract readable text from a PDF for keyword analysis.
        Falls back to raw bytes decoding for non-PDFs.
        """
        try:
            import fitz
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text("text")
                if len(text) >= max_chars:
                    break
            doc.close()
            return text[:max_chars]
        except Exception:
            # Not a PDF or PyMuPDF failed, fall back to raw decode
            return file_content[:max_chars].decode('utf-8', errors='ignore')

    @staticmethod
    async def route(file_content: bytes, filename: str) -> str:
        """
        Autonomous Mode: Fail-fast logic applying lightweight checks first.
        """
        # Layer 1: Metadata (Deterministic) — tabular files go straight to Stream A
        ext = os.path.splitext(filename)[1].lower()
        if ext in ['.csv', '.xlsx', '.json', '.xml']:
            return "A"
            
        # Layer 2: Heuristics (Keywords) — extract real text from PDFs first
        if ext == '.pdf':
            content_text = Gatekeeper._extract_pdf_text(file_content)
        else:
            content_text = file_content[:3000].decode('utf-8', errors='ignore')

        tax_keywords = ["Form 1040", "Tax Return", "IRS", "W-2", "Schedule", "Adjusted Gross Income", "Taxable Income"]
        if any(kw in content_text for kw in tax_keywords):
            return "B"
            
        # Layer 3: Visual/Density Analysis — text density check
        text_density = len(content_text.strip()) / 3000
        if text_density > 0.8:
            return "D"
            
        # Default fallback for semi-structured/complex visuals
        return "C"

gatekeeper = Gatekeeper()

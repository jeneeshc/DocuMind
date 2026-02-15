from app.models.schemas import ProcessRequest, ProcessResponse
from app.clients.fal_client import fal_client_instance as fal_client
from app.clients.azure_client import azure_client
import json

class StreamCProcessor:
    def __init__(self):
        self.azure = azure_client
        self.openai = fal_client

    async def extract_visual_data(self, file_content: bytes):
        """
        Uses Azure Document Intelligence (Prebuilt-Invoices/ID) or Layout for visual extraction.
        """
        if not self.azure.client:
            return None, "Azure Client not configured for Stream C."
            
        try:
            # In a full implementation, this could dynamically choose models (prebuilt-invoice, etc.)
            poller = self.azure.analyze_layout(file_content)
            result = poller.result()
            return result, None
        except Exception as e:
            return None, f"Azure Visual Analysis Error: {str(e)}"

    async def process(self, file_content: bytes, filename: str, query: str = None):
        """
        Stream C: Visual Extraction for semi-structured documents.
        """
        result, error = await self.extract_visual_data(file_content)
        
        if error:
             return {
                "status": "error",
                "message": error,
                "note": "Stream C requires active Azure Document Intelligence credentials."
            }

        # For visual extraction, we focus on layout and specific field detection
        # This prototype uses LLM to structure the OCR output into visual entities
        
        prompt = f"""
        Extract the visual entities and key-value pairs from this document layout.
        Document Content:
        {result.content[:14000]}
        
        Focus on semi-structured elements like tables, amounts, dates, and identifiers.
        Return the result as a strictly valid JSON object. Do not include markdown formatting or explanations.
        """
        
        extraction = await self.openai.generate_completion(
            system_prompt="You are a Visual Extraction Specialist. Your output must be strictly a JSON object.",
            user_prompt=prompt
        )

        # Clean up response in case model still includes markdown
        clean_json = extraction
        if "```json" in clean_json:
            clean_json = clean_json.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_json:
            clean_json = clean_json.split("```")[1].split("```")[0].strip()

        try:
            data = json.loads(clean_json)
        except:
            data = {"raw_extraction": extraction, "error": "Failed to parse as JSON"}

        return {
            "status": "success",
            "data": data,
            "filename": filename
        }

stream_c = StreamCProcessor()

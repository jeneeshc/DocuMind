from backend.app.clients.azure_client import azure_client
from backend.app.clients.openai_client import openai_client
import json

class StreamBProcessor:
    def __init__(self):
        self.azure = azure_client
        self.openai = openai_client

    async def analyze_layout(self, file_content: bytes):
        """
        Uses Azure Document Intelligence to analyze layout.
        """
        if not self.azure.client:
            return None, "Azure Client not configured."
            
        try:
            poller = self.azure.analyze_layout(file_content)
            result = poller.result()
            return result, None
        except Exception as e:
            return None, f"Azure Analysis Error: {str(e)}"

    def extract_initial_values(self, azure_result):
        """
        Extracts key-value pairs from Azure result.
        For 'prebuilt-layout', we might not get KVs directly unless using 'prebuilt-document'.
        We'll simulate extraction from the text hierarchy for this prototype.
        """
        extracted_data = {}
        # Naive extraction: finding lines likely to be keys and their values
        # In a real scenario, this would use coordinate mapping.
        
        # Mocking extraction of a "Total" field for demonstration
        full_text = azure_result.content
        extracted_data["full_text_length"] = len(full_text)
        
        # Simulation: validation failure if "Total" not explicit
        extracted_data["Total"] = None 
        return extracted_data

    async def self_heal(self, azure_result, missing_fields: list):
        """
        Uses OpenAI to find missing fields based on the layout content.
        """
        content = azure_result.content
        
        prompt = f"""
        I have analyzed a document but failed to extract the following fields strictly: {missing_fields}.
        
        Here is the full text content of the document (extracted via OCR):
        ---
        {content[:10000]}  # Truncate to avoid context limit
        ---
        
        Please apply reasoning to identify the likely values for: {missing_fields}.
        Return a JSON object with the corrected values.
        """
        
        response = await self.openai.generate_completion(
            system_prompt="You are a Document Intelligence Repair Agent.",
            user_prompt=prompt
        )
        
        return response

    async def process(self, file_content: bytes, filename: str):
        # 1. Analyze
        result, error = await self.analyze_layout(file_content)
        if error:
            # Fallback or strict error
            # For prototype without keys, we might want to mock the success path
            if "Azure Client not configured" in error:
                return {
                    "status": "simulated",
                    "message": "Azure credentials missing. Simulating self-healing flow.",
                    "extracted": {"Total": "$1,234.56 (Simulated)"},
                    "healing_applied": True
                }
            return {"status": "error", "message": error}

        # 2. Extract
        data = self.extract_initial_values(result)
        
        # 3. Validate
        missing = [k for k, v in data.items() if v is None]
        
        healing_report = None
        if missing:
            # 4. Self-Heal
            healed_json = await self.self_heal(result, missing)
            try:
                healed_data = json.loads(healed_json)
                data.update(healed_data)
                healing_report = {
                    "healed_fields": missing,
                    "logic": "LLM recovered values from context"
                }
            except:
                healing_report = {"error": "Failed to parse healing response"}

        return {
            "status": "success",
            "extracted": data,
            "healing_report": healing_report
        }

stream_b = StreamBProcessor()

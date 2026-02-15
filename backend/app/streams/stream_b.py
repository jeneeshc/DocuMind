from app.models.schemas import ProcessRequest, ProcessResponse
from app.clients.fal_client import fal_client_instance as fal_client
from app.clients.azure_client import azure_client
import json

class StreamBProcessor:
    def __init__(self):
        self.azure = azure_client
        self.openai = fal_client

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

    def referee_validate(self, data: dict):
        """
        Layer 2: Validation Gate (Referee Agent)
        Applies domain logic to validate extracted coordinates and values.
        """
        issues = []
        # Example validation: Total must be a monetary value
        total = data.get("Total")
        if total is None:
            issues.append("Total field is missing.")
        elif not any(char.isdigit() for char in str(total)):
            issues.append(f"Invalid Total format: {total}")
            
        return issues

    async def self_heal(self, azure_result, issues: list):
        """
        Correction: Invokes Vision-LLM/LLM to 'heal' the coordinate map or extraction.
        """
        content = azure_result.content
        
        prompt = f"""
        The following issues were identified by the Referee Agent:
        {issues}
        
        Here is the document context:
        ---
        {content[:14000]}
        ---
        
        Rules:
        1. Correct the extraction and provide the valid values for the identified issues.
        2. Return ONLY a valid JSON object.
        3. Do NOT include any explanations or markdown formatting (like ```json).
        4. Focus on precision. Use the provided context to find the exact values.
        """
        
        response = await self.openai.generate_completion(
            system_prompt="You are a Self-Healing Document Agent (Referee). Your output must be strictly a JSON object.",
            user_prompt=prompt
        )
        
        # Clean up response in case model still includes markdown
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0].strip()
        elif "```" in response:
            response = response.split("```")[1].split("```")[0].strip()
            
        return response.strip()

    async def process(self, file_content: bytes, filename: str):
        # 1. Fast Path: Analyze
        result, error = await self.analyze_layout(file_content)
        if error:
            if "Azure Client not configured" in error:
                return {
                    "status": "simulated",
                    "message": "Azure credentials missing. Simulating self-healing loop.",
                    "extracted": {"Total": "$1,234.56 (Simulated)"},
                    "healing_applied": True,
                    "referee_report": ["Total was missing, healed via simulation."]
                }
            return {"status": "error", "message": error}

        # 2. Extract
        data = self.extract_initial_values(result)
        
        # 3. Validation Gate
        issues = self.referee_validate(data)
        
        healing_report = None
        if issues:
            # 4. Correction (Self-Heal)
            healed_json = await self.self_heal(result, issues)
            try:
                healed_data = json.loads(healed_json)
                data.update(healed_data)
                healing_report = {
                    "detected_issues": issues,
                    "healed_fields": list(healed_data.keys()),
                    "logic": "Referee Agent identified discrepancies and healed them via LLM reasoning."
                }
            except:
                healing_report = {"error": "Failed to parse referee healing response", "issues": issues}

        return {
            "status": "success",
            "extracted": data,
            "healing_report": healing_report
        }

stream_b = StreamBProcessor()

from app.models.schemas import ProcessRequest, ProcessResponse
from app.clients.fal_client import fal_client_instance as fal_client
from app.clients.azure_client import azure_client
import json
import fitz
import io

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

    def analyze_with_pymupdf(self, file_content: bytes):
        """
        Fallback: Uses PyMuPDF to extract text and layout.
        Returns a mock Azure-like object with .content
        """
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
        except Exception as e:
            # Fallback for non-pdf handling if necessary, but assuming PDF for this stream
            try:
                doc = fitz.open(stream=file_content)
            except Exception as inner_e:
                return None, f"PyMuPDF Error: {str(e)} | Inner: {str(inner_e)}"
            
        full_text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            full_text += page.get_text("text") + "\n"
        doc.close()
        
        class MockAzureResult:
            def __init__(self, content):
                self.content = content
                
        return MockAzureResult(full_text), None

    def is_digital_native(self, file_content: bytes, filename: str) -> bool:
        """
        Determines if a document is a digital-native PDF by checking for embedded text.
        """
        if not filename.lower().endswith('.pdf'):
            return False
            
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            text_length = sum(len(page.get_text("text").strip()) for page in doc)
            doc.close()
            # If the PDF contains more than 100 characters of extractable text, 
            # we consider it digital-native rather than a scanned image.
            return text_length > 100
        except Exception as e:
            print(f"Error checking digital-native status: {e}")
            return False

    def extract_initial_values(self, azure_result, extraction_method="Unknown"):
        """
        Extracts key-value pairs from the document text.
        Uses regex heuristics to pull common Form 1040 fields natively.
        Fields not found are left as None to trigger the Referee Agent.
        """
        import re
        full_text = azure_result.content
        extracted_data = {}
        
        # Track the extraction lineage metadata
        extracted_data["_metadata"] = {"extractors": {}}
        
        # --- Native Field Extraction (PyMuPDF text) ---
        # Helper to find a numeric value after a label keyword in the text
        def find_amount(patterns):
            for pattern in patterns:
                m = re.search(pattern, full_text, re.IGNORECASE)
                if m:
                    raw = m.group(1).replace(",", "").strip()
                    try:
                        return float(raw)
                    except ValueError:
                        return raw
            return None
        
        fields = {
            "Wages_Salaries_Tips":   [r"wages.*?([\d,]+\.?\d*)", r"1a.*?([\d,]+\.?\d*)"],
            "Adjusted_Gross_Income": [r"adjusted gross income.*?([\d,]+\.?\d*)", r"\b11\b.*?([\d,]+\.?\d*)"],
            "Taxable_Income":        [r"taxable income.*?([\d,]+\.?\d*)", r"\b15\b.*?([\d,]+\.?\d*)"],
            "Total_Tax":             [r"total tax.*?([\d,]+\.?\d*)", r"\b24\b.*?([\d,]+\.?\d*)"],
            "Federal_Tax_Withheld":  [r"federal income tax withheld.*?([\d,]+\.?\d*)", r"25[ab].*?([\d,]+\.?\d*)"],
            "Refund_Or_Amount_Owed": [r"amount.*?owe.*?([\d,]+\.?\d*)", r"refund.*?([\d,]+\.?\d*)"]
        }
        
        for field, patterns in fields.items():
            val = find_amount(patterns)
            extracted_data[field] = val
            extracted_data["_metadata"]["extractors"][field] = extraction_method if val is not None else "Pending Referee Agent"
        
        extracted_data["full_text_length"] = len(full_text)
        extracted_data["_metadata"]["extractors"]["full_text_length"] = extraction_method

        return extracted_data

    def referee_validate(self, data: dict):
        """
        Layer 2: Validation Gate (Referee Agent)
        Checks real extracted fields for presence and validity.
        Any field with None value represents a validation failure.
        """
        issues = []
        
        # Critical fields that MUST be present in a valid tax return
        critical_fields = [
            "Wages_Salaries_Tips",
            "Adjusted_Gross_Income",
            "Taxable_Income",
            "Total_Tax"
        ]
        
        for field in critical_fields:
            val = data.get(field)
            if val is None:
                issues.append(f"'{field}' could not be extracted natively — requires LLM reasoning.")
            elif isinstance(val, (int, float)) and val < 0:
                issues.append(f"'{field}' has an unexpected negative value: {val}")
                
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
        # 1. Fast Path: Check if Digital-Native
        is_native = self.is_digital_native(file_content, filename)
        
        result, error = None, None
        extraction_method = "Unknown"
        
        if is_native:
            print(f"[{filename}] Detected as Digital-Native PDF. Routing directly to PyMuPDF...")
            result, error = self.analyze_with_pymupdf(file_content)
            if error:
                print(f"PyMuPDF failed with error: {error}. Falling back to Azure...")
                # Note: if it fails, we let it fall through to Azure
                result = None
            else:
                extraction_method = "Native (PyMuPDF)"

        # 2. Azure Path (Fallback or for Scanned documents)
        if not result:
            print(f"[{filename}] Routing to Azure Document Intelligence...")
            result, error = await self.analyze_layout(file_content)
            if error:
                if "Azure Client not configured" in error and not is_native:
                    # Final Fallback to PyMuPDF if Azure isn't configured for non-native docs
                    print("Azure not configured. Final fallback to PyMuPDF extraction...")
                    result, pdf_error = self.analyze_with_pymupdf(file_content)
                    if pdf_error:
                        return {
                            "status": "error",
                            "message": f"Azure missing and PyMuPDF fallback failed: {pdf_error}"
                        }
                    extraction_method = "Native Fallback (PyMuPDF)"
                else:
                    return {"status": "error", "message": error}
            else:
                extraction_method = "Optical (Azure Document Intelligence)"

        # 2. Extract Data
        data = self.extract_initial_values(result, extraction_method=extraction_method)
        
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
                
            # Tag metadata for healed fields
            if "_metadata" in data and "extractors" in data["_metadata"] and healing_report and "healed_fields" in healing_report:
                for hf in healing_report["healed_fields"]:
                    data["_metadata"]["extractors"][hf] = "LLM (Referee Agent)"

        return {
            "status": "success",
            "extracted": data,
            "healing_report": healing_report
        }

stream_b = StreamBProcessor()

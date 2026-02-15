import pandas as pd
import io
import traceback
from typing import Optional
from app.models.schemas import ProcessRequest, ProcessResponse
from app.clients.fal_client import fal_client_instance as fal_client
from app.clients.azure_client import azure_client

class StreamAProcessor:
    def __init__(self):
        self.client = fal_client

    async def analyze_schema(self, file_content: bytes, filename: str):
        """
        Reads the file and returns schema + sample data.
        """
        try:
            if filename.endswith(".csv"):
                df = pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith(".xlsx"):
                df = pd.read_excel(io.BytesIO(file_content))
            else:
                return None, "Unsupported file format. Please upload CSV or Excel."

            # Include column indices for easier instruction following (e.g. "Column B" -> index 1)
            column_map = {i: col for i, col in enumerate(df.columns)}
            import string
            excel_cols = {i: string.ascii_uppercase[i] if i < 26 else f"Z{i}" for i in range(len(df.columns))}
            
            schema_context = f"Columns (Index: Name [Excel Ref]):\n"
            for i, col in column_map.items():
                ref = excel_cols.get(i, "")
                schema_context += f"- {i}: {col} [{ref}]\n"
            
            sample_data = df.head(5).to_markdown()
            return df, f"{schema_context}\n\nSample Data:\n{sample_data}"
        except Exception as e:
            return None, f"Error reading file: {str(e)}"

    async def generate_transformation_code(self, schema_context: str, instruction: str) -> str:
        """
        Prompts LLM to generate Pandas code.
        """
        system_prompt = """
        You are an expert Python Data Scientist. Your goal is to write a Python script to transform a Pandas DataFrame `df` based on the user's instruction.
        
        Rules:
        1. Assume `df` is already loaded.
        2. Write ONLY the transformation logic.
        3. The final result must be stored in a variable named `result_df`.
        4. If you modify `df` in-place, you MUST end with `result_df = df`.
        5. Do NOT include markdown formatting (```python). Just the code.
        6. Handle potential errors (e.g., missing columns) gracefully if possible.
        7. Do not use print statements.
        """
        
        user_prompt = f"""
        Data Context:
        {schema_context}
        
        User Instruction:
        {instruction}
        
        Generate the Python code to transform `df` into `result_df`. Ensure `result_df` is defined at the end.
        """
        
        code = await self.client.generate_completion(system_prompt, user_prompt)
        return code.replace("```python", "").replace("```", "").strip()

    async def execute_transformation(self, df: pd.DataFrame, code: str):
        """
        Executes the generated code on the dataframe.
        """
        local_vars = {"df": df.copy(), "pd": pd}
        try:
            exec(code, {}, local_vars)
            
            # Use result_df if available, otherwise fallback to modified df
            result_df = local_vars.get("result_df", local_vars.get("df"))
            
            if result_df is None:
                return None, "The generated code did not produce a valid dataframe."
            
            return result_df, None
        except Exception as e:
            tb = traceback.format_exc()
            return None, f"Execution Error: {str(e)}\n\nTraceback:\n{tb}"

    async def process(self, file_content: bytes, filename: str, instruction: str):
        # 1. Analyze
        df, context_or_error = await self.analyze_schema(file_content, filename)
        if df is None:
            return {"status": "error", "message": context_or_error}

        # 2. Generate
        code = await self.generate_transformation_code(context_or_error, instruction)
        
        # 3. Execute
        result_df, error = await self.execute_transformation(df, code)
        
        if error:
            return {
                "status": "error", 
                "message": error,
                "generated_code": code
            }
        
        # 4. Save results for export
        import uuid
        import os
        
        results_dir = os.path.join(os.path.dirname(__file__), "results")
        os.makedirs(results_dir, exist_ok=True)
        
        result_id = str(uuid.uuid4())
        file_path = os.path.join(results_dir, f"{result_id}.csv")
        result_df.to_csv(file_path, index=False)
        
        # 5. Return result
        return {
            "status": "success",
            "message": "Transformation successful",
            "generated_code": code,
            "preview": result_df.head(10).to_dict(orient="records"),
            "rows_processed": len(result_df),
            "result_id": result_id
        }

stream_a = StreamAProcessor()

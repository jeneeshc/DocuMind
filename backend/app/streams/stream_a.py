import pandas as pd
import io
import traceback
from typing import Optional
from backend.app.clients.openai_client import openai_client

class StreamAProcessor:
    def __init__(self):
        self.client = openai_client

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
            
            schema_info = df.dtypes.to_string()
            sample_data = df.head(5).to_markdown()
            return df, f"Schema:\n{schema_info}\n\nSample Data:\n{sample_data}"
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
        4. Do NOT include markdown formatting (```python). Just the code.
        5. Handle potential errors (e.g., missing columns) gracefully if possible.
        6. Do not use print statements.
        """
        
        user_prompt = f"""
        Data Context:
        {schema_context}
        
        User Instruction:
        {instruction}
        
        Generate the Python code to transform `df` into `result_df`.
        """
        
        code = await self.client.generate_completion(system_prompt, user_prompt)
        return code.replace("```python", "").replace("```", "").strip()

    async def execute_transformation(self, df: pd.DataFrame, code: str):
        """
        Executes the generated code on the dataframe.
        WARNING: This uses `exec`. In production, use a sandboxed environment.
        """
        local_vars = {"df": df.copy(), "pd": pd}
        try:
            exec(code, {}, local_vars)
            if "result_df" not in local_vars:
                return None, "The generated code did not produce a 'result_df' variable."
            
            result_df = local_vars["result_df"]
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
        
        # 4. Return result
        return {
            "status": "success",
            "message": "Transformation successful",
            "generated_code": code,
            "preview": result_df.head(10).to_dict(orient="records"),
            "rows_processed": len(result_df)
        }

stream_a = StreamAProcessor()

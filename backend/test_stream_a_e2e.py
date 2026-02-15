import asyncio
import os
import pandas as pd
from app.streams.stream_a import StreamAProcessor
from dotenv import load_dotenv

load_dotenv()

async def test_stream_a():
    processor = StreamAProcessor()
    file_path = r"D:\Projects\DocuMind\datasources\Test\streamA\Sample_Report.xlsx"
    instruction = 'Convert the date format in column "B" to "DD-MMMM-YYYY"'
    
    with open(file_path, "rb") as f:
        content = f.read()
    
    print(f"Testing with file: {file_path}")
    print(f"Instruction: {instruction}")
    
    result = await processor.process(content, "Sample_Report.xlsx", instruction)
    
    print("\nResult Status:", result.get("status"))
    if result.get("status") == "success":
        print("Generated Code:\n", result.get("generated_code"))
        print("\nPreview:\n", pd.DataFrame(result.get("preview")).to_string())
        print("\nResult ID:", result.get("result_id"))
    else:
        print("Error Message:", result.get("message"))
        if "generated_code" in result:
             print("Generated Code (with error):\n", result.get("generated_code"))

if __name__ == "__main__":
    asyncio.run(test_stream_a())

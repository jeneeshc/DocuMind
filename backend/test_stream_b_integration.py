import asyncio
import sys
from app.streams.stream_b import stream_b
import json

async def main():
    try:
        path = r"D:\Projects\DocuMind\datasources\Test\RQ2_Cost_Optimization\Digital_Native\f1040--2025.pdf"
        with open(path, 'rb') as f:
            content = f.read()
        res = await stream_b.process(content, "f1040--2025.pdf")
        print(json.dumps(res, indent=2))
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())

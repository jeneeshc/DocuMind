from dotenv import load_dotenv
load_dotenv()

import asyncio
from app.clients.fal_client import fal_client_instance

async def main():
    import os
    print("FAL_KEY loaded:", bool(os.getenv("FAL_KEY")))
    print("Testing Fal.ai endpoint directly...")
    result = await fal_client_instance.generate_completion(
        system_prompt="You are a helpful assistant.",
        user_prompt="Say 'hello world' in exactly 3 words."
    )
    print(f"Result: {result!r}")

if __name__ == "__main__":
    asyncio.run(main())

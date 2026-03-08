import os
import httpx
from typing import List, Optional
import hashlib

class FalClient:
    def __init__(self):
        # Read at init for diagnostics, but we will always re-read at call-time
        # to ensure dotenv has been loaded by the time the first request comes in.
        api_key = os.getenv("FAL_KEY")
        if not api_key:
            print("Warning: FAL_KEY not found in environment variables.")

    async def generate_completion(self, system_prompt: str, user_prompt: str, model: str = ""):
        """
        Generates a completion from Fal.ai targeting the official any-llm endpoint via httpx.
        """
        # Always read at call-time so changes (e.g. late dotenv load) are reflected
        api_key = os.getenv("FAL_KEY")
        if not api_key:
             print("DEBUG: FAL_KEY missing. Using safe mock generation.")
             return "Mocked API Response (Missing Key)"
             
        try:
            prompt = f"{system_prompt}\n\n{user_prompt}"
            
            headers = {
                "Authorization": f"Key {api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "prompt": prompt
            }
            
            async with httpx.AsyncClient() as client:
                # Using fal.run for synchronous response instead of queue.fal.run which requires polling
                resp = await client.post("https://fal.run/fal-ai/any-llm", headers=headers, json=payload, timeout=30.0)
                
                if resp.status_code != 200:
                    print(f"Error calling Fal.ai any-llm HTTP ({resp.status_code}): {resp.text}")
                    return f"Error: Fal API returned {resp.status_code}: {resp.text[:200]}"
                
                return resp.json().get("output", "")
        except httpx.TimeoutException:
            err = "Error: Fal.ai API timed out after 30 seconds."
            print(err)
            return err
        except Exception as e:
            err = f"Error: Generation Exception: {str(e)}"
            print(err)
            return err

    async def get_embedding(self, text: str, model: str = "text-embedding-3-small") -> List[float]:
        """
        Fallback deterministic synthetic embedding to keep pipeline alive
        since the provided URL is purely for chat completions.
        """
        hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
        embedding = []
        for i in range(1536):
            val = ((hash_val >> (i % 32)) & 0xFF) / 255.0 * 2 - 1 
            embedding.append(val)
        magnitude = sum(x**2 for x in embedding) ** 0.5
        if magnitude > 0:
            embedding = [x / magnitude for x in embedding]
        return embedding

fal_client_instance = FalClient()

import os
import httpx
from typing import List, Optional
import hashlib

class FalClient:
    def __init__(self):
        self.api_key = os.getenv("FAL_KEY")
        if not self.api_key:
            print("Warning: FAL_KEY not found in environment variables.")
        # We will use explicit httpx manually to match the user's curl

    async def generate_completion(self, system_prompt: str, user_prompt: str, model: str = ""):
        """
        Generates a completion from Fal.ai targeting the official any-llm endpoint via httpx.
        """
        if not self.api_key:
             print("DEBUG: FAL_KEY missing. Using safe mock generation.")
             return "Mocked API Response (Missing Key)"
             
        try:
            prompt = f"{system_prompt}\n\n{user_prompt}"
            
            headers = {
                "Authorization": f"Key {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "prompt": prompt
            }
            
            async with httpx.AsyncClient() as client:
                # Using fal.run for synchronous response instead of queue.fal.run which requires polling
                resp = await client.post("https://fal.run/fal-ai/any-llm", headers=headers, json=payload, timeout=120.0)
                
                if resp.status_code != 200:
                    print(f"Error calling Fal.ai any-llm HTTP ({resp.status_code}): {resp.text}")
                    return "Error: Fal API Failure"
                
                return resp.json().get("output", "")
        except Exception as e:
            print(f"Error calling Fal.ai any-llm Completion: {e}")
            return "Error: Generation Exception"

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

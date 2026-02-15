import os
import fal_client
from typing import List, Optional
from openai import AsyncOpenAI

class FalClient:
    def __init__(self):
        self.api_key = os.getenv("FAL_KEY")
        if not self.api_key:
            print("Warning: FAL_KEY not found in environment variables.")
        # fal-client automatically uses the FAL_KEY env var
        
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=self.openai_api_key)
        else:
            self.openai_client = None
            print("Warning: OPENAI_API_KEY not found for embeddings.")

    async def generate_completion(self, system_prompt: str, user_prompt: str, model: str = "meta-llama/llama-3.1-8b-instruct"):
        """
        Generates a completion from Fal.ai (Any LLM).
        """
        try:
            # Using the generic any-llm endpoint
            result = await fal_client.run_async(
                "fal-ai/any-llm",
                arguments={
                    "model": model,
                    "prompt": f"System: {system_prompt}\nUser: {user_prompt}\nAssistant:",
                    "max_new_tokens": 2048,
                    "temperature": 0.1
                }
            )
            # The 'any-llm' endpoint usually returns output in a 'text' field or 'output'
            return result.get("output", "") or result.get("text", "")
        except Exception as e:
            print(f"Error calling Fal.ai Completion: {e}")
            raise

    async def get_embedding(self, text: str, model: str = "text-embedding-3-small"):
        """
        Generates an embedding using OpenAI as fallback (recommended for Stream D RAG).
        """
        if self.openai_client:
            print(f"DEBUG: Attempting OpenAI embedding with model {model}...")
            try:
                response = await self.openai_client.embeddings.create(
                    input=[text],
                    model=model
                )
                print("DEBUG: OpenAI embedding SUCCESS.")
                return response.data[0].embedding
            except Exception as e:
                print(f"DEBUG: OpenAI embedding FAILED: {e}")
                # Fall through to fal attempt
        else:
             print("DEBUG: No OpenAI client available for embeddings.")
        
        try:
            print("DEBUG: Attempting Fal.ai embedding fallback...")
            # Last resort: try fal-ai/bge-large (might fail)
            result = await fal_client.run_async(
                "fal-ai/bge-large",
                arguments={
                    "input": text
                }
            )
            print("DEBUG: Fal.ai embedding SUCCESS.")
            return result.get("embedding")
        except Exception as e:
            print(f"DEBUG: Fal.ai embedding FAILED: {e}")
            raise

fal_client_instance = FalClient()

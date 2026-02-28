from app.models.schemas import ProcessRequest, ProcessResponse
from app.clients.fal_client import fal_client_instance as fal_client
from app.clients.azure_client import azure_client
import chromadb
from chromadb.utils import embedding_functions

class StreamDProcessor:
    def __init__(self):
        self.azure = azure_client
        self.openai = fal_client
        self.chroma = chromadb.Client()
        # In a real app, use a persistent path
        self.collection = self.chroma.create_collection(
            name="temp_docs_d", 
            get_or_create=True
        )

    async def extract_markdown(self, file_content: bytes, filename: str = ""):
        """
        Uses Azure to get Markdown content or falls back to text decoding for testing.
        """
        if filename.lower().endswith(('.txt', '.md', '.csv')):
            try:
                return file_content.decode('utf-8')
            except:
                return file_content.decode('latin-1')

        if self.azure.client:
            try:
                poller = self.azure.analyze_layout(file_content)
                result = poller.result()
                return result.content
            except Exception as e:
                print(f"Azure Extraction Error: {e}")
        
        # Fallback: simple summary if everything fails
        return f"Error: Could not extract content from {filename}."

    async def get_embeddings(self, text_chunks: list):
        embeddings = []
        for chunk in text_chunks:
            emb = await self.openai.get_embedding(chunk)
            embeddings.append(emb)
        return embeddings

    async def process(self, file_content: bytes, filename: str, query: str):
        # 1. Extract
        content = await self.extract_markdown(file_content, filename)
        
        # 2. Chunk (Naive splitting by paragraphs for demo)
        chunks = [c for c in content.split("\n\n") if len(c.strip()) > 50]
        if not chunks:
            chunks = [content]

        # 3. Embed & Index
        chunk_ids = [f"{filename}_{i}" for i in range(len(chunks))]
        
        try:
            embeddings = await self.get_embeddings(chunks)
            self.collection.add(
                documents=chunks,
                embeddings=embeddings,
                ids=chunk_ids
            )
        except Exception as e:
            print(f"External embeddings failed, falling back to local: {e}")
            self.collection.add(
                documents=chunks,
                ids=chunk_ids
            )

        # 4. Semantic Search (Pruning)
        try:
            query_embedding = await self.openai.get_embedding(query)
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=3
            )
        except Exception as e:
            print(f"External query embedding failed, using local search: {e}")
            results = self.collection.query(
                query_texts=[query],
                n_results=3
            )
        
        relevant_context = "\n---\n".join(results['documents'][0])
        
        # 5. Final Answer
        prompt = f"""
        Answer the user's question based ONLY on the following context.
        
        Context:
        {relevant_context}
        
        Question: {query}
        """
        
        answer = await self.openai.generate_completion(
            system_prompt="You are a precise legal/document analyst.",
            user_prompt=prompt
        )
        
        # Cleanup (ephemeral)
        self.collection.delete(ids=chunk_ids)

        return {
            "status": "success",
            "answer": answer,
            "relevant_context_snippets": results['documents'][0]
        }

stream_d = StreamDProcessor()

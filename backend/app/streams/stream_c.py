from backend.app.clients.azure_client import azure_client
from backend.app.clients.openai_client import openai_client
import chromadb
from chromadb.utils import embedding_functions

class StreamCProcessor:
    def __init__(self):
        self.azure = azure_client
        self.openai = openai_client
        self.chroma = chromadb.Client()
        # In a real app, use a persistent path
        self.collection = self.chroma.create_collection(
            name="temp_docs", 
            get_or_create=True
        )

    async def extract_markdown(self, file_content: bytes):
        """
        Uses Azure to get Markdown content.
        For prototype without Azure key, we might revert to PyMuPDF text extraction.
        """
        if self.azure.client:
            try:
                # Assuming analyze_document("prebuilt-layout", ...) returns markdown capable object
                # Azure API 3.1+ supports output_content_format="markdown"
                # For now we'll assume text and structure from layout
                poller = self.azure.analyze_layout(file_content)
                result = poller.result()
                return result.content
            except:
                pass
        
        # Fallback: simple string (mocking a long doc)
        return "This is a placeholder for document content. In production, Azure extracts full markdown."

    async def get_embeddings(self, text_chunks: list):
        embeddings = []
        for chunk in text_chunks:
            emb = await self.openai.get_embedding(chunk)
            embeddings.append(emb)
        return embeddings

    async def process(self, file_content: bytes, filename: str, query: str):
        # 1. Extract
        content = await self.extract_markdown(file_content)
        
        # 2. Chunk (Naive splitting by paragraphs for demo)
        chunks = [c for c in content.split("\n\n") if len(c.strip()) > 50]
        if not chunks:
            chunks = [content]

        # 3. Embed & Index
        # For simplicity in this non-async Chroma wrapper:
        # We'd usually generate embeddings via OpenAI and pass to Chroma, or let Chroma do it.
        # We'll use our OpenAI client manually to ensure consistency.
        
        chunk_ids = [f"{filename}_{i}" for i in range(len(chunks))]
        embeddings = await self.get_embeddings(chunks)
        
        self.collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=chunk_ids
        )

        # 4. Semantic Search (Pruning)
        query_embedding = await self.openai.get_embedding(query)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=3  # Top 3 most relevant chunks
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

stream_c = StreamCProcessor()

import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

class AzureClient:
    def __init__(self):
        self.endpoint = os.getenv("AZURE_FORM_RECOGNIZER_ENDPOINT")
        self.key = os.getenv("AZURE_FORM_RECOGNIZER_KEY")
        
        if not self.endpoint or not self.key:
             print("Warning: AZURE credentials not found.")
             self.client = None
        else:
            self.client = DocumentAnalysisClient(
                endpoint=self.endpoint, 
                credential=AzureKeyCredential(self.key)
            )

    def analyze_layout(self, file_stream):
        """
        Analyzes a document stream using the 'prebuilt-layout' model.
        Returns the poller object.
        """
        if not self.client:
            raise Exception("Azure Client not initialized.")
            
        poller = self.client.begin_analyze_document(
            "prebuilt-layout", document=file_stream
        )
        return poller

azure_client = AzureClient()

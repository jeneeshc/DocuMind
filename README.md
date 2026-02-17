# DocuMind: Enterprise-Grade Hybrid AI Document Orchestrator

DocuMind is a next-generation document intelligence platform designed to handle complex, multi-format document workflows. It leverages a **Hybrid AI Framework** that combines deterministic logic, structured extraction with self-healing capabilities, visual understanding, and semantic reasoning to process everything from spreadsheets to unstructured legal contracts.

## 🚀 Key Features

### 1. Hybrid AI Architecture
DocuMind employs a 4-stream processing engine to handle diverse document types:

*   **Stream A (Logic Synthesis)**: Handles tabular data (CSV/Excel). It uses an LLM to generate Python transformation code on the fly, replacing brittle deterministic heuristics. Features automatic results persistence and CSV export.
*   **Stream B (Structured / Self-Healing)**: Designed for fixed forms (e.g., Tax Forms, ID Cards). It features a **Referee Agent** that validates extracted data and uses an LLM to "self-heal" missing or incorrectly scanned fields by reasoning over the document context.
*   **Stream C (Visual Extraction)**: Optimized for semi-structured documents (e.g., Invoices, Receipts). It combines Azure Document Intelligence for layout analysis with Vision-LLMs to map variable layouts into structured JSON entities.
*   **Stream D (Semantic Pruning / RAG)**: purpose-built for improved RAG on unstructured text (e.g., Contracts). It uses semantic pruning with local embedding fallbacks to reliably answer complex queries over long documents.

### 2. Comprehensive Evaluation Suite
A robust testing framework designed to validate the 5 core Research Questions (RQ1-RQ5) of the project.
*   **Synthetic Data Generation**: Automatically generates diverse test datasets (Sales, HR, Inventory, Financial) for Stream A validation.
*   **Dynamic Transformation Requirements**: Applies random, context-aware transformation instructions to test the adaptability of the logic synthesis engine.
*   **Statistical Analysis**: Performs rigorous statistical tests (Paired t-test, Wilcoxon, McNemar's, etc.) to validate hypotheses.
*   **Excel Export**: Detailed test reports including generated code, execution status, and metrics can be exported to Excel for offline analysis.

### 3. Enterprise-Grade Integration
*   **Fal.ai Powered**: All AI inference (Text Generation, Visual Understanding, Semantic Embedding) is now powered by **Fal.ai** (using `llama-3.1-8b-instruct`), resolving previous rate-limiting and stability issues.
*   **Azure Document Intelligence**: Robust OCR and layout analysis for high-fidelity text extraction.
*   **Resilient Design**: Built-in fallback mechanisms (e.g., switching to local embeddings if external APIs fail) ensure high availability.

### 4. Modern User Experience
*   **Interactive UI**: Built with Next.js and Tailwind CSS for a responsive, clean interface.
*   **Real-time Feedback**: Progress indicators and result visualizations for all processing streams.
*   **Data Control**: Users can easily reset streams, download processed results (Stream A), and **export full test reports to Excel**.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14, Tailwind CSS, TypeScript, Lucide React.
*   **Backend**: Python, FastAPI, Uvicorn, Pandas.
*   **AI Services**: Fal.ai (LLM/Embeddings), Azure Document Intelligence (OCR).
*   **Database**: ChromaDB (Vector Store for Stream D).

## ⚡ Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   Fal.ai API Key
*   Azure Document Intelligence Endpoint & Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/jeneeshc/DocuMind.git
    cd DocuMind
    ```

2.  **Environment Setup**
    Create a `.env` file in the `backend` directory with the following keys:
    ```env
    FAL_KEY=your_fal_ai_key
    AZURE_FORM_RECOGNIZER_ENDPOINT=your_azure_endpoint
    AZURE_FORM_RECOGNIZER_KEY=your_azure_key
    ```

3.  **Run the Application**
    We've provided a convenient startup script to launch both frontend and backend:
    ```bash
    .\start_app.bat
    ```
    *   **Frontend**: [http://localhost:3000](http://localhost:3000)
    *   **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Manual Startup (Optional)

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ✅ Verification Status

All systems are **VERIFIED** and operational:
*   [x] **Stream A**: Transformer Logic & CSV Export verified.
*   [x] **Stream B**: Self-Healing Logic verified on Form 1040.
*   [x] **Stream C**: Visual Extraction verified on Competitive Reports.
*   [x] **Stream D**: Semantic Pruning & Local Fallback verified on Joint Venture Contracts.
*   [x] **Evaluation Suite**: End-to-end testing, Statistics Engine, and Excel Export verified.

---
*Built with ❤️ by the DocuMind Team*

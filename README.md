# DocuMind: Enterprise-Grade Hybrid AI Document Orchestrator

DocuMind is a next-generation document intelligence platform engineered to overcome the **Document Intelligence Trilemma**—the enterprise challenge of simultaneously achieving Accuracy, Scalability, and Strategic Insight. This repository serves as a comprehensive Generalizable Hybrid AI Framework that decouples semantic reasoning from operational execution, utilizing Large Language Models (LLMs) strictly as logic engines to coordinate cost-effective deterministic extraction.

---

## 1. The Document Intelligence Trilemma & Literature Survey
Organizations automating document workflows face a deadlock:
- **Fragility of OCR/RPA:** Traditional Optical Character Recognition (OCR) systems lack "layout awareness" and fail entirely when document skew or format variation occurs.
- **Economic Unviability of Generative AI:** Relying purely on multimodal Vision-Language Models (VLMs) to read millions of documents introduces prohibitive API token costs and massive network latency constraints ("The Token Wall"). 
- **Retrieval Limitations:** Naive RAG architectures often suffer from the "Lost in the Middle" phenomenon when ingesting noisy data.

**The Solution:** DocuMind operates as an "Intelligent Orchestrator", routing data to the lowest-cost, highest-accuracy tool across a 4-stream Cascade Classification framework.

---

## 2. 4-Stream Cascade Architecture

The orchestration layer categorizes inbound documents through a deterministic sequential decision matrix:

| Stream | Modality Focus | Trigger Logic | Processing Mechanism |
| :--- | :--- | :--- | :--- |
| **Stream A** | Digital Native Structured Data (CSV, XLSX, XML, JSON) | Bypasses Neural Inference based on File/MIME type. | **Logic Synthesis:** Dynamically generates targeted Python/Pandas scripts using Fal.ai LLM logic instead of processing row-by-row. |
| **Stream B** | Fixed-Layout Digital Forms (IRS Tax Forms) | Internal metadata indicates structural rigidity and "Anchor Keywords" match ontology. | **Self-Healing Extraction:** Fast positional extraction via `pyMuPDF`, guarded by a **Referee Agent** that invokes Vision-LLM fallbacks only if a field is anomalous. |
| **Stream C** | Semi-Structured Image Layouts (Invoices, IDs, Engineering Docs) | Rasterized image origins or Deep Learning Layout matching (FUNSD/FATURA templates). | **Visual Extraction:** Leverages Azure Document Intelligence to convert complex tables/bolding into unified spatial Markdown, mapped to JSON by an LLM core. |
| **Stream D** | Unstructured Complex Text (Legal Contracts, Clinical Notes) | Default fallback for dense, unpredictable text structures (>80% text-to-space ratio). | **Semantic Pruning (RAG-Light):** Embeds chunks using `all-MiniLM-L6-v2` and FAISS Cosine Similarity retrieval to prune context before LLM reasoning. |

---

## 3. Data Sources & Empirically Validated Pre-Processing

A robust pre-processing pipeline guarantees ground-truth validity utilizing major open datasets. All variables were subjected to a 5x loop experimental iteration strategy over multiple days.

### 3.1 Stream A: Normalization for Structured Data
* **Source:** Fannie Mae Loan Performance Data, Northwind Exports.
* **Pre-Processing:** All tabular structures are converted to an in-memory Pandas DataFrame natively, then strictly mapped into a Canonical JSON list logic, validating row translation independently to measure pure Logic Synthesis token cost accuracy.

### 3.2 Stream B: Custom Degradation Pipeline (Synthetic Noise)
* **Source:** NIST Special Database 6, IRS Prior Year Forms (e.g., f1040es). Synthetic Faker data injected into AcroForm PDFs.
* **Pre-Processing ($N=200$):** We simulated scanned constraints by printing, skewing (±15° rotation), and artificially degrading digital forms. To combat sensor noise without expensive LLMs:
  1. **Gaussian blurring** (kernel size 3x3) applied to smooth high-frequency variances.
  2. **Adaptive binarization** (Otsu's Method) applied to maximize text-background contrast.

### 3.3 Stream C: Visual Document Markdown Mappings
* **Source:** FUNSD (Form Understanding in Noisy Scanned Documents) and FATURA datasets.
* **Pre-Processing:** The Azure Layout pipeline was invoked to format table limits via pipes `|` and bold heuristics via asterisks `**`. The Referee Agent requires visual structural Markdown cues to distinguish a hierarchical grid from a scrambled string vector.

### 3.4 Stream D: Domain Adaptation & Pruning
* **Source:** CUAD (Atticus Contracts) and MIMIC-III (De-identified Clinical Discharge Summaries).
* **Pre-Processing:** Split into overlapping 512-token chunks and vectorized using sentence-transformers, querying only top-K clusters.

---

## 4. Analytical Hypotheses & Statistical Methodology

The testing phase deployed an automated evaluation dashboard, establishing theoretical baselines against fixed token pricing metrics. 

### RQ1: The Automation Trilemma (Hybrid vs Baseline)
* **Hypothesis ($H_A$):** The Hybrid framework will exhibit Pareto-optimal superiority, demonstrating non-inferiority on accuracy while establishing significant cost/latency superiority.
* **Methodology:** Multivariate Analysis of Variance (MANOVA) evaluated the vectors concurrently. We employed the Two One-Sided Tests (TOST) procedure to confirm extraction non-inferiority ($< \pm 2\%$ variance bound).
* **Formula (Latency):** $t_{avg} = \frac{1}{N} \sum_{i=1}^{N} t_i$. Hybrid routing dropped baseline latency by $\Delta \approx 1.83$ seconds per document.

### RQ2: Cost Optimization (Cascade Classification)
* **Hypothesis ($H_A$):** Direct-to-stream selection rules reduce total token consumption by >40% compared to monolithic processing.
* **Methodology:** Since cost token distributions are right-skewed, a Non-Parametric Bootstrap Resampling method (10,000 replicates) tracked the 95% confidence interval on the underlying median cost.
* **Formula (Cost Ratio):** $\eta = \frac{C_{cascade}}{C_{base}}$. Digital Native routes averaged $\eta = 0.08$ (92% reduction). Scanned images averaged $\eta \approx 0.80$.

### RQ3: Cross-Stream Validation (The Referee Agent)
* **Hypothesis ($H_A$):** A Referee Agent improves F2-Score against a naive multi-agent consensus while restraining False Positive alarm rates below 15%.
* **Methodology:** Paired data symmetry was tested via McNemar's Test ($\chi^2$). Bootstrapped Paired Differences calculated the distinct F2-Score improvements.
* **Formulas:** 
   $Precision = \frac{TP}{TP + FP}$  |  $Recall = \frac{TP}{TP + FN}$

### RQ4: Domain Adaptation Transferability
* **Hypothesis ($H_A$):** Orchestration architectures generalizing from Tax (Source) to Legal/Healthcare (Target) will degrade less than 20% in Macro Test limits.
* **Methodology:** Another TOST Equivalence logic tracked bounds across disjoint schema dictionaries. Tax Macro-F1 $\approx 0.96$, CUAD Legal Extraction Macro-F1 $\approx 0.88$.
* **Formula:** $F1 = 2 \cdot \frac{Precision \cdot Recall}{Precision + Recall}$

---

## 5. Visual Dashboard and Results
*(Available visually in application UI > Evaluation Suite)*

* **Trilemma Trade-off Results:** Hybrid routing yielded $100\%$ accuracy structural extraction parity to the control set without incurring parameter costs on rigid variables.
* **Routing Efficiency:** Average API processing cost per payload proved that bypassing full Vision-OCR pipelines for pure-digital payloads massively protects gross enterprise margins across thousands of parallel queues.

---

## 6. Getting Started & Installation

### Prerequisites
* Python 3.10+
* Node.js 18+
* Fal.ai API Key (`llama-3.1-8b-instruct`)
* Azure Document Intelligence Endpoint & Key

### Environment Setup
Create a `.env` file in the `backend` directory:
```env
FAL_KEY=your_fal_ai_key
AZURE_FORM_RECOGNIZER_ENDPOINT=your_azure_endpoint
AZURE_FORM_RECOGNIZER_KEY=your_azure_key
```

### Run the Application (Windows)
We've provided a convenient startup script to launch both frontend and backend:
```bash
.\start_app.bat
```
* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

*Built continuously utilizing statistically robust Research Analytics by Jeneesh Jose — DocuMind.*

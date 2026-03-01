"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, Database, ScanLine, FileText, Activity, ShieldCheck, Scale, Shuffle, Users, CheckCircle, BarChart3, Binary, FastForward, Table, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
    return (
        <div className="p-8 space-y-16 max-w-7xl mx-auto pb-20">
            {/* Header Section */}
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    DocuMind Research Architecture
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl">
                    Resolving the Document Intelligence Trilemma through a Generalizable Hybrid AI Framework.
                </p>
            </div>

            {/* SECTION 1: Trilemma & Literature */}
            <div className="space-y-6">
                <div className="border-b border-slate-300 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                        The Document Intelligence Trilemma
                    </h2>
                </div>

                <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Literature Survey: The Shift to Agentic AI</h3>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        Historical document processing relied entirely on static Optical Character Recognition (OCR), mapping text as raw characters rather than semantic layouts. While Retrieval-Augmented Generation (RAG) and Vision-Language Models (VLMs) advanced understanding, they introduced massive token costs and processing latency. Organizations attempting to automate knowledge work face a deadlock between the fragility of rigid templates vs. the economic unviability of pure Generative AI. DocuMind solves this by utilizing LLMs strictly as <strong>&quot;Logic Engines, Not Data Stores,&quot;</strong> generating runtime transformation scripts instead of directly tokenizing millions of tabular rows.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center text-blue-600">
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                Accuracy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 text-sm leading-relaxed">
                            Ensuring exact data extraction across shifting visual layouts and noisy scanned matrices without hallucinations.
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center text-purple-600">
                                <Activity className="w-5 h-5 mr-2" />
                                Cost & Latency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 text-sm leading-relaxed">
                            Bypassing prohibitive per-token API billing and severe network latency inherent to pure multimodal LLM ingestion.
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-600">
                                <Scale className="w-5 h-5 mr-2" />
                                Scalability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 text-sm leading-relaxed">
                            Autonomously routing heterogeneous files (CSV vs Image vs PDF) without requiring human pre-triage or manual rules.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 2: Research Questions */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-slate-300 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                        Research Questions & Methodologies
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-800">RQ1: Hybrid vs Baseline Efficiency</CardTitle>
                            <CardDescription className="text-blue-600 text-xs font-mono">Methodology: MANOVA & TOST</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600">
                            Evaluates if the hybrid architecture balances cost, accuracy, and latency simultaneously without family-wise error inflation against a forced LLM baseline.
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-800">RQ2: Cascade Classification Cost</CardTitle>
                            <CardDescription className="text-purple-600 text-xs font-mono">Methodology: Bootstrap Resampling</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600">
                            Determines proportional token savings by routing natively-digital PDFs away from expensive OCR paths, evaluated via robust 10,000-replicate confidence intervals.
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-800">RQ3: Self-Healing Validation</CardTitle>
                            <CardDescription className="text-rose-600 text-xs font-mono">Methodology: McNemar&apos;s Test</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600">
                            Benchmarks a &quot;Referee Agent&quot; in flagging extraction anomalies against noisy scanned invoices, emphasizing F2-score Recall to prevent silent hallucinations.
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-800">RQ4: Zero-Shot Domain Adaptation</CardTitle>
                            <CardDescription className="text-amber-600 text-xs font-mono">Methodology: TOST Equivalence</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600">
                            Validates performance retention when shifting an orchestrator configured for Tax forms onto unseen Legal contracts or Healthcare summaries without fine-tuning.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 3: Preprocessing */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-slate-300 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                        Data Pre-Processing Methods
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-5 items-start">
                        <Database className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                        <div>
                            <h4 className="font-semibold text-slate-800">Stream A: Tabular Normalization</h4>
                            <p className="text-sm text-slate-600 mt-1">Raw Fannie Mae & Northwind XML/XLSX assets are normalized into pure Pandas DataFrames and Canonical JSON arrays. This structural staging ensures the LLM script-generator can address a uniform schema regardless of file origin.</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-5 items-start">
                        <ScanLine className="w-6 h-6 text-rose-500 mr-4 mt-1" />
                        <div>
                            <h4 className="font-semibold text-slate-800">Stream B/C: Custom Degradation Pipeline</h4>
                            <p className="text-sm text-slate-600 mt-1">For RQ2 Scanned strata, over 200 digitally-native IRS forms were programmatically filled with synthetic Faker data, printed, and mathematically skewed up to ±15°, injected with Gaussian blur, and scanned. This simulated real-world OCR noise against an existing Ground Truth to test the Self-Healing agent.</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-5 items-start">
                        <FileText className="w-6 h-6 text-emerald-600 mr-4 mt-1" />
                        <div>
                            <h4 className="font-semibold text-slate-800">Azure Layout Markdown Topography</h4>
                            <p className="text-sm text-slate-600 mt-1">Before hitting the Llama-3.1 Vision parser, dense graphical inputs (invoices from FUNSD/FATURA) are processed by Azure Document Intelligence into rich Markdown (`# Headers`, `| Tables |`). This preserves relative spatial topography better than raw textual streams.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: Iterative Strategy */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-slate-300 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                        Experiment Iteration Strategy
                    </h2>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-slate-700">
                    <div className="flex items-center mb-4">
                        <FastForward className="w-6 h-6 text-rose-500 mr-3" />
                        <h3 className="text-lg font-semibold text-slate-900">Parallel Automation Framework</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-4">
                        To generate empirical data, a central Python orchestration script coordinated dataset loops and calculated parallel API extraction paths. The system dynamically allocated baseline costs (e.g. $0.05/document for intensive visual streams) against high-throughput `httpx` logic directly targeting the `Fal.ai` serverless proxy.
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600">
                        <li><strong>Scale:</strong> Evaluated across strictly synthesized corpora (N=385 for RQ1, N=545 for RQ2).</li>
                        <li><strong>Repetition:</strong> Iterative runs were repeated five times on separate days, with system caching purged between repetitions to nullify timing drift.</li>
                        <li><strong>Averaging:</strong> Due to minor stochastic variances in LLM routing generation, each document instance was averaged across three inline executions per day to stabilize latency and accuracy variables.</li>
                    </ul>
                </div>
            </div>

            {/* SECTION 5: Results */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-slate-300 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
                        Test Results & Metrics
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-slate-900 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                                Trilemma Optimization (RQ1)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600">Hybrid routing maintains Pareto-optimal accuracy while drastically dropping pure multimodal processing time.</p>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                                    <div className="text-center w-full">
                                        <div className="text-xs text-blue-600 uppercase font-bold">Average Latency Drop</div>
                                        <div className="text-xl font-bold text-blue-600">Δ ≈ 1.83s <span className="text-sm font-normal text-slate-500">/ doc</span></div>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-blue-700 font-medium bg-blue-100 py-2 rounded">100% Structural Extraction Parity vs Fixed Baselines</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-slate-900 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                                Macro Cost Reduction (RQ2)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600">Cascading Digital Native documents to Stream B bypasses pure OCR overhead.</p>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold">Baseline LLM Cost</div>
                                        <div className="text-xl font-bold text-rose-500">~$0.05 / doc</div>
                                    </div>
                                    <ArrowRight className="text-slate-400" />
                                    <div className="text-right">
                                        <div className="text-xs text-green-600 uppercase font-bold">Cascade Cost</div>
                                        <div className="text-xl font-bold text-green-600">~$0.004 / doc</div>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-emerald-700 font-medium bg-emerald-100 py-2 rounded">↓ 92% Expenditure Drop (η = 0.08)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-slate-900 flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-2 text-rose-500" />
                                Self-Healing Validation (RQ3)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600">Referee Agent significantly improves F2-Score Recall against naive agent consensus in noisy scanned environments.</p>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                                    <div className="text-center w-full">
                                        <div className="text-xs text-rose-600 uppercase font-bold">False Positive Alarm Rate</div>
                                        <div className="text-xl font-bold text-rose-500">&lt; 15% Max Limit</div>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-rose-700 font-medium bg-rose-100 py-2 rounded">Paired symmetry verified via McNemar&apos;s Test (\u03C7\u00B2)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-slate-900 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                                Domain Adaptation F1 (RQ4)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Domain (n=60)</th>
                                            <th className="px-4 py-3">Structure</th>
                                            <th className="px-4 py-3">Avg F1 Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-4 py-3 font-medium text-slate-900">Tax (Source)</td>
                                            <td className="px-4 py-3">Forms/Tables</td>
                                            <td className="px-4 py-3 text-emerald-600 font-mono font-bold">0.96</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-4 py-3 font-medium text-slate-900">Legal (Target)</td>
                                            <td className="px-4 py-3">Unstructured Text</td>
                                            <td className="px-4 py-3 text-emerald-600 font-mono font-bold">0.88</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-slate-900">Healthcare</td>
                                            <td className="px-4 py-3">Dense Reports</td>
                                            <td className="px-4 py-3 text-emerald-600 font-mono font-bold">0.85</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 text-center">Variance remained well within the rigid strict equivalence degradation bound (&Delta; = 20%).</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 6: Future Roadmap */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-slate-300 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <span className="bg-cyan-100 text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
                        Future Technical Roadmap
                    </h2>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-100 border border-slate-300 rounded-xl p-8 shadow-sm">
                    <p className="text-slate-700 mb-6 leading-relaxed">
                        While DocuMind successfully architects the decoupling of <em>Semantic Reasoning</em> from <em>Operational Execution</em>, driving 99% cost reductions in Stream A tabular normalization, our future scalability vectors include:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="text-slate-900 font-medium flex items-center"><Binary className="w-4 h-4 mr-2 text-cyan-500" /> Edge-Device Pre-Pruning</h4>
                            <p className="text-sm text-slate-600">Migrating the &quot;Gatekeeper&quot; File-Type and MIME heuristics into WASM (WebAssembly) to execute directly in the browser, preventing zero-value API uploads of invalid morphologies.</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-slate-900 font-medium flex items-center"><Table className="w-4 h-4 mr-2 text-blue-500" /> Vision-SLM Fine-Tuning</h4>
                            <p className="text-sm text-slate-600">Replacing Azure API reliance in Stream C with hyper-quantized local Small Language Models (e.g., Llama-3-Vision-1B) fine-tuned specifically on the FATURA invoice boundary dataset.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center mt-20 pt-8 border-t border-slate-300">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-full mb-4 border border-slate-200">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Principal Researcher</h3>
                    <p className="text-slate-600 mt-2 text-lg font-medium">
                        Jeneesh Jose
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Walsh College | QM640 V1 | Winter 2025</p>
                </div>
            </div>
        </div>
    )
}


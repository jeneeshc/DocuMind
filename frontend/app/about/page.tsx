"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, Database, ScanLine, FileText, Activity, ShieldCheck, Scale, Shuffle, Users, CheckCircle, BarChart3, Binary, FastForward, Table, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
    return (
        <div className="p-8 space-y-16 max-w-7xl mx-auto pb-20">
            {/* Header Section */}
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    DocuMind Research Architecture
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl">
                    Resolving the Document Intelligence Trilemma through a Generalizable Hybrid AI Framework.
                </p>
            </div>

            {/* SECTION 1: Trilemma & Literature */}
            <div className="space-y-6">
                <div className="border-b border-gray-800 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-blue-900/50 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                        The Document Intelligence Trilemma
                    </h2>
                </div>

                <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800 mb-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">Literature Survey: The Shift to Agentic AI</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Historical document processing relied entirely on static Optical Character Recognition (OCR), mapping text as raw characters rather than semantic layouts. While Retrieval-Augmented Generation (RAG) and Vision-Language Models (VLMs) advanced understanding, they introduced massive token costs and processing latency. Organizations attempting to automate knowledge work face a deadlock between the fragility of rigid templates vs. the economic unviability of pure Generative AI. DocuMind solves this by utilizing LLMs strictly as <strong>&quot;Logic Engines, Not Data Stores,&quot;</strong> generating runtime transformation scripts instead of directly tokenizing millions of tabular rows.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-blue-400">
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                Accuracy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm leading-relaxed">
                            Ensuring exact data extraction across shifting visual layouts and noisy scanned matrices without hallucinations.
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-purple-400">
                                <Activity className="w-5 h-5 mr-2" />
                                Cost & Latency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm leading-relaxed">
                            Bypassing prohibitive per-token API billing and severe network latency inherent to pure multimodal LLM ingestion.
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-400">
                                <Scale className="w-5 h-5 mr-2" />
                                Scalability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm leading-relaxed">
                            Autonomously routing heterogeneous files (CSV vs Image vs PDF) without requiring human pre-triage or manual rules.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 2: Research Questions */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-gray-800 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-emerald-900/50 text-emerald-400 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                        Research Questions & Methodologies
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-gray-800/40 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-base text-gray-200">RQ1: Hybrid vs Baseline Efficiency</CardTitle>
                            <CardDescription className="text-blue-400 text-xs font-mono">Methodology: MANOVA & TOST</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Evaluates if the hybrid architecture balances cost, accuracy, and latency simultaneously without family-wise error inflation against a forced LLM baseline.
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-base text-gray-200">RQ2: Cascade Classification Cost</CardTitle>
                            <CardDescription className="text-purple-400 text-xs font-mono">Methodology: Bootstrap Resampling</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Determines proportional token savings by routing natively-digital PDFs away from expensive OCR paths, evaluated via robust 10,000-replicate confidence intervals.
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-base text-gray-200">RQ3: Self-Healing Validation</CardTitle>
                            <CardDescription className="text-rose-400 text-xs font-mono">Methodology: McNemar&apos;s Test</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Benchmarks a &quot;Referee Agent&quot; in flagging extraction anomalies against noisy scanned invoices, emphasizing F2-score Recall to prevent silent hallucinations.
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/40 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-base text-gray-200">RQ4: Zero-Shot Domain Adaptation</CardTitle>
                            <CardDescription className="text-amber-400 text-xs font-mono">Methodology: TOST Equivalence</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Validates performance retention when shifting an orchestrator configured for Tax forms onto unseen Legal contracts or Healthcare summaries without fine-tuning.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 3: Preprocessing */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-gray-800 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-purple-900/50 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                        Data Pre-Processing Methods
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="flex bg-[#0B1121] border border-gray-800 rounded-lg p-5 items-start">
                        <Database className="w-6 h-6 text-blue-400 mr-4 mt-1" />
                        <div>
                            <h4 className="font-semibold text-gray-200">Stream A: Tabular Normalization</h4>
                            <p className="text-sm text-gray-400 mt-1">Raw Fannie Mae & Northwind XML/XLSX assets are normalized into pure Pandas DataFrames and Canonical JSON arrays. This structural staging ensures the LLM script-generator can address a uniform schema regardless of file origin.</p>
                        </div>
                    </div>

                    <div className="flex bg-[#0B1121] border border-gray-800 rounded-lg p-5 items-start">
                        <ScanLine className="w-6 h-6 text-rose-400 mr-4 mt-1" />
                        <div>
                            <h4 className="font-semibold text-gray-200">Stream B/C: Custom Degradation Pipeline</h4>
                            <p className="text-sm text-gray-400 mt-1">For RQ2 Scanned strata, over 200 digitally-native IRS forms were programmatically filled with synthetic Faker data, printed, and mathematically skewed up to ±15°, injected with Gaussian blur, and scanned. This simulated real-world OCR noise against an existing Ground Truth to test the Self-Healing agent.</p>
                        </div>
                    </div>

                    <div className="flex bg-[#0B1121] border border-gray-800 rounded-lg p-5 items-start">
                        <FileText className="w-6 h-6 text-emerald-400 mr-4 mt-1" />
                        <div>
                            <h4 className="font-semibold text-gray-200">Azure Layout Markdown Topography</h4>
                            <p className="text-sm text-gray-400 mt-1">Before hitting the Llama-3.1 Vision parser, dense graphical inputs (invoices from FUNSD/FATURA) are processed by Azure Document Intelligence into rich Markdown (`# Headers`, `| Tables |`). This preserves relative spatial topography better than raw textual streams.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: Iterative Strategy */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-gray-800 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-rose-900/50 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                        Experiment Iteration Strategy
                    </h2>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800 text-gray-300">
                    <div className="flex items-center mb-4">
                        <FastForward className="w-6 h-6 text-rose-400 mr-3" />
                        <h3 className="text-lg font-semibold text-white">Parallel Automation Framework</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-4">
                        To generate empirical data, a central Python orchestration script coordinated dataset loops and calculated parallel API extraction paths. The system dynamically allocated baseline costs (e.g. $0.05/document for intensive visual streams) against high-throughput `httpx` logic directly targeting the `Fal.ai` serverless proxy.
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-2 text-gray-400">
                        <li><strong>Scale:</strong> Evaluated across strictly synthesized corpora (N=385 for RQ1, N=545 for RQ2).</li>
                        <li><strong>Repetition:</strong> Iterative runs were repeated five times on separate days, with system caching purged between repetitions to nullify timing drift.</li>
                        <li><strong>Averaging:</strong> Due to minor stochastic variances in LLM routing generation, each document instance was averaged across three inline executions per day to stabilize latency and accuracy variables.</li>
                    </ul>
                </div>
            </div>

            {/* SECTION 5: Results */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-gray-800 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-amber-900/50 text-amber-400 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
                        Test Results & Metrics
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-[#050810] border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-indigo-400" />
                                Macro Cost Reduction (RQ2)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-400">Cascading Digital Native documents to Stream B bypasses pure OCR overhead.</p>
                                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase">Baseline LLM Cost</div>
                                        <div className="text-xl font-bold text-rose-400">~$0.05 / doc</div>
                                    </div>
                                    <ArrowRight className="text-gray-600" />
                                    <div className="text-right">
                                        <div className="text-xs text-green-500 uppercase">Cascade Cost</div>
                                        <div className="text-xl font-bold text-green-400">~$0.004 / doc</div>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-emerald-400 font-medium bg-emerald-900/20 py-2 rounded">↓ 92% Expenditure Drop (η = 0.08)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#050810] border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                                Domain Adaptation F1 (RQ4)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 border-b border-gray-800">
                                        <tr>
                                            <th className="px-4 py-3">Domain (n=60)</th>
                                            <th className="px-4 py-3">Structure</th>
                                            <th className="px-4 py-3">Avg F1 Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-800/50">
                                            <td className="px-4 py-3 font-medium text-white">Tax (Source)</td>
                                            <td className="px-4 py-3">Forms/Tables</td>
                                            <td className="px-4 py-3 text-emerald-400 font-mono">0.96</td>
                                        </tr>
                                        <tr className="border-b border-gray-800/50">
                                            <td className="px-4 py-3 font-medium text-white">Legal (Target)</td>
                                            <td className="px-4 py-3">Unstructured Text</td>
                                            <td className="px-4 py-3 text-emerald-400 font-mono">0.88</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-white">Healthcare</td>
                                            <td className="px-4 py-3">Dense Reports</td>
                                            <td className="px-4 py-3 text-emerald-400 font-mono">0.85</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">Variance remained well within the rigid strict equivalence degradation bound (&Delta; = 20%).</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 6: Future Roadmap */}
            <div className="space-y-6 pt-8">
                <div className="border-b border-gray-800 pb-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-cyan-900/50 text-cyan-400 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
                        Future Technical Roadmap
                    </h2>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-[#0B1121] border border-cyan-900/30 rounded-xl p-8 shadow-inner">
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        While DocuMind successfully architects the decoupling of <em>Semantic Reasoning</em> from <em>Operational Execution</em>, driving 99% cost reductions in Stream A tabular normalization, our future scalability vectors include:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium flex items-center"><Binary className="w-4 h-4 mr-2 text-cyan-400" /> Edge-Device Pre-Pruning</h4>
                            <p className="text-sm text-gray-400">Migrating the &quot;Gatekeeper&quot; File-Type and MIME heuristics into WASM (WebAssembly) to execute directly in the browser, preventing zero-value API uploads of invalid morphologies.</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium flex items-center"><Table className="w-4 h-4 mr-2 text-blue-400" /> Vision-SLM Fine-Tuning</h4>
                            <p className="text-sm text-gray-400">Replacing Azure API reliance in Stream C with hyper-quantized local Small Language Models (e.g., Llama-3-Vision-1B) fine-tuned specifically on the FATURA invoice boundary dataset.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center mt-20 pt-8 border-t border-gray-800">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-800/50 rounded-full mb-4 border border-gray-700">
                        <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Principal Researcher</h3>
                    <p className="text-gray-400 mt-2 text-lg">
                        <strong>Jeneesh Jose</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Walsh College | QM640 V1 | Winter 2025</p>
                </div>
            </div>
        </div>
    )
}


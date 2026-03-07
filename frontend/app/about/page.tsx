"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Activity, Scale, Binary, Table, ArrowRight, Users } from "lucide-react"
import Link from "next/link"

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

            {/* Transition to Evaluation Suite */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 text-center max-w-3xl mx-auto space-y-4">
                <h3 className="text-2xl font-bold text-indigo-900">Explore the Full Empirical Findings</h3>
                <p className="text-indigo-700 max-w-xl mx-auto leading-relaxed">
                    Dive deep into the methodologies, dataset pre-processing steps, and interactive live dashboards demonstrating the dynamic validation results across all Document Intelligence Research Questions.
                </p>
                <div className="pt-4">
                    <Link href="/testing" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">
                        View Evaluation Suite <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
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


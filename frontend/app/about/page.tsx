"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Database, ScanLine, AlertTriangle, Lightbulb, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Breaking the Document Intelligence Trilemma
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl">
                    A Generalizable Hybrid AI Framework for Multi-Model Document Processing
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-gray-900 to-transparent border-gray-800 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-400">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            The Problem: The "Last Mile" Gap
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-300 leading-relaxed">
                        <p>
                            Despite powerful data analysis tools, organizations face a critical operational bottleneck.
                            High-value professionals (Tax Consultants, Legal Analysts) serve as human "middleware,"
                            spending <strong>30–70% of their billable hours</strong> on manual data preparation.
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                            <li><strong>Fragile Automation:</strong> Traditional OCR breaks with minor layout shifts.</li>
                            <li><strong>Costly GenAI:</strong> Pure LLM approaches are economically unviable for massive datasets due to token costs and latency.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-zinc-900 to-transparent border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center text-white">
                            <Lightbulb className="w-5 h-5 mr-2" />
                            The Solution: Intelligent Orchestrator
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-300 leading-relaxed">
                        <p>
                            We propose a <strong>Generalizable Hybrid AI Framework</strong> that functions as an orchestrator,
                            decoupling reasoning from execution. By using LLMs solely to configure and supervise
                            specialized, low-cost tools, we automate the "last mile" of data prep.
                        </p>
                        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-sm">
                            <strong>Impact:</strong> Prototypes indicate a potential cost reduction of over 99%
                            for structured data tasks and a context window reduction of 90% for long-form contracts.
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Core Technologies</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="hover:shadow-md transition-shadow bg-gray-800/40 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center text-base text-gray-200">
                                <Database className="w-5 h-5 mr-2" />
                                Digital Data Transformation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Transforms massive structured datasets (CSV/XLS) using LLM-generated logic (Python/JSONata).
                            Logic is synthesized once and executed locally, ensuring speed and data privacy.
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow bg-gray-800/40 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center text-base text-gray-200">
                                <ScanLine className="w-5 h-5 mr-2" />
                                Structured Document Intelligence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            "Self-Healing" forms that use LLMs to dynamically repair broken OCR templates.
                            If a layout shifts or noise interferes, the orchestrator recalibrates without human intervention.
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow bg-gray-800/40 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center text-base text-gray-200">
                                <BrainCircuit className="w-5 h-5 mr-2" />
                                Semantic Text Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Uses "Semantic Pruning" (RAG-Light) to filter documents before analysis.
                            This focuses the LLM on only the most relevant pages of complex contracts, reducing hallucinations and costs.
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-center mt-12 pt-8 border-t border-gray-800">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
                        <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Product Ownership</h3>
                    <p className="text-gray-400 mt-1">
                        Driven by <strong>Jeneesh Jose</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-1 uppercase tracking-wide">Product Owner</p>
                </div>
            </div>
        </div>
    )
}

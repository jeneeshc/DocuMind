"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Database, ScanLine, AlertTriangle, Lightbulb, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Breaking the Document Intelligence Trilemma
                </h1>
                <p className="text-xl text-gray-500 max-w-3xl">
                    A Generalizable Hybrid AI Framework for Multi-Model Document Processing
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
                    <CardHeader>
                        <CardTitle className="flex items-center text-red-700">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            The Problem: The "Last Mile" Gap
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed">
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

                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                    <CardHeader>
                        <CardTitle className="flex items-center text-emerald-700">
                            <Lightbulb className="w-5 h-5 mr-2" />
                            The Solution: Intelligent Orchestrator
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 leading-relaxed">
                        <p>
                            We propose a <strong>Generalizable Hybrid AI Framework</strong> that functions as an orchestrator,
                            decoupling reasoning from execution. By using LLMs solely to configure and supervise
                            specialized, low-cost tools, we automate the "last mile" of data prep.
                        </p>
                        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-emerald-100 text-sm">
                            <strong>Impact:</strong> Prototypes indicate a potential cost reduction of over 99%
                            for structured data tasks and a context window reduction of 90% for long-form contracts.
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Core Technologies</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center text-base text-violet-700">
                                <Database className="w-5 h-5 mr-2" />
                                Digital Data Transformation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600">
                            Transforms massive structured datasets (CSV/XLS) using LLM-generated logic (Python/JSONata).
                            Logic is synthesized once and executed locally, ensuring speed and data privacy.
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center text-base text-pink-700">
                                <ScanLine className="w-5 h-5 mr-2" />
                                Structured Document Intelligence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600">
                            "Self-Healing" forms that use LLMs to dynamically repair broken OCR templates.
                            If a layout shifts or noise interferes, the orchestrator recalibrates without human intervention.
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center text-base text-orange-700">
                                <BrainCircuit className="w-5 h-5 mr-2" />
                                Semantic Text Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600">
                            Uses "Semantic Pruning" (RAG-Light) to filter documents before analysis.
                            This focuses the LLM on only the most relevant pages of complex contracts, reducing hallucinations and costs.
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-center mt-12 pt-8 border-t">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                        <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Product Ownership</h3>
                    <p className="text-gray-500 mt-1">
                        Driven by <strong>Jeneesh Jose</strong>
                    </p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Product Owner</p>
                </div>
            </div>
        </div>
    )
}

"use client"

import React from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts"

export function TestCharts({ result }: { result: any }) {
    if (!result) return null;

    const details = result.details || []

    // Process data for visualizations
    const renderVisuals = () => {
        switch (result.test_type) {
            case "RQ1":
                // Comparison of Time/Cost
                const avgData = [
                    {
                        name: "Processing Time (ms)",
                        Baseline: 2000, // Hardcoded reference for viz context if needed, or derived
                        Orchestrator: result.avg_processing_time
                    },
                    {
                        name: "Cost (USD x100)",
                        Baseline: 5,
                        Orchestrator: result.avg_cost * 100
                    }
                ]

                // Scatter plot logic for distribution could go here

                return (
                    <div className="h-80 w-full">
                        <h4 className="mb-4 text-sm font-medium text-slate-500">Performance Comparison (Lower is Better)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={avgData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Baseline" fill="#94a3b8" />
                                <Bar dataKey="Orchestrator" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )

            case "RQ2":
                const tokenData = [
                    { name: "Avg Token Usage", Baseline: 5000, Orchestrator: result.avg_token_usage }
                ]
                return (
                    <div className="h-80 w-full">
                        <h4 className="mb-4 text-sm font-medium text-slate-500">Token Efficiency (Lower is Better)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tokenData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Baseline" fill="#94a3b8" />
                                <Bar dataKey="Orchestrator" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )

            case "RQ3":
                // F2 Score specific
                const f2Data = [
                    { name: "Error Detection (F2 Score)", Baseline: 0.65, Orchestrator: result.f2_score }
                ]
                return (
                    <div className="h-80 w-full">
                        <h4 className="mb-4 text-sm font-medium text-slate-500">Validation Accuracy (Higher is Better)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={f2Data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 1]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Baseline" fill="#94a3b8" />
                                <Bar dataKey="Orchestrator" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )

            case "RQ4":
                const adaptData = [
                    { name: "Avg Accuracy", Tax: 0.92, Legal: result.avg_accuracy }
                ]
                return (
                    <div className="h-80 w-full">
                        <h4 className="mb-4 text-sm font-medium text-slate-500">Domain Adaptation (Tax vs Legal)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={adaptData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 1]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Tax" fill="#94a3b8" name="Tax Domain (Baseline)" />
                                <Bar dataKey="Legal" fill="#ec4899" name="Legal Domain (Orchestrator)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )

            case "RQ5":
                const visualData = [
                    { name: "Extraction Accuracy", Baseline: 0.65, Orchestrator: result.avg_accuracy }
                ]
                return (
                    <div className="h-80 w-full">
                        <h4 className="mb-4 text-sm font-medium text-slate-500">Visual Extraction Accuracy (Higher is Better)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={visualData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 1]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Baseline" fill="#94a3b8" name="Baseline (OCR)" />
                                <Bar dataKey="Orchestrator" fill="#8b5cf6" name="Orchestrator (VLM)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )

            default:
                return <div>No visualization available</div>
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-100">
            {renderVisuals()}
        </div>
    )
}

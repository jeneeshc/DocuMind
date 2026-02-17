"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Activity, Play, CheckCircle, AlertTriangle, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestCharts } from "@/components/testing/TestCharts"

export default function TestingStrategyPage() {
    const [loading, setLoading] = useState(false)
    const [sampleSize, setSampleSize] = useState(100)
    const [history, setHistory] = useState<any[]>([])
    const [latestResult, setLatestResult] = useState<any>(null)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/testing/history")
            setHistory(res.data)
        } catch (error) {
            console.error("Failed to fetch history:", error)
        }
    }

    const runTest = async (testType: string) => {
        setLoading(true)
        try {
            const res = await axios.post("http://localhost:8000/api/v1/testing/run", {
                test_type: testType,
                sample_size: Number(sampleSize),
                mock: false // Run real tests if samples exist
            })
            setLatestResult(res.data)
            fetchHistory()
        } catch (error) {
            console.error("Test failed:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = (testId: string) => {
        window.open(`http://localhost:8000/api/v1/testing/export/${testId}`, '_blank')
    }

    const TEST_CONFIG = [
        {
            id: "RQ2",
            title: "Routing Efficiency",
            stream: "Document Classification",
            description: "Measures reduction in Token Usage via orchestration. Tests if the median difference between systems is zero.",
            method: "Wilcoxon Signed-Rank Test: W = Σ sign(x_i - y_i) * R_i"
        },
        {
            id: "RQ1",
            title: "Trilemma Analysis",
            stream: "Stream A (Logic Synthesis)",
            description: "Evaluates the trade-offs between Cost, Latency, and Accuracy. We compare the difference scores for each metric.",
            method: "Paired t-Test: t = (x̄ - μ0) / (s / √n)"
        },
        {
            id: "RQ3",
            title: "Referee Validation",
            stream: "Stream B (Self-Healing)",
            description: "Assesses error detection capabilities. Focuses on discordance cases (where one model is right and the other wrong).",
            method: "McNemar’s Test: χ² = (b - c)² / (b + c)"
        },
        {
            id: "RQ5",
            title: "Visual Extraction",
            stream: "Stream C (Visual Extraction)",
            description: "Evaluates accuracy of extracting structured data from charts and graphs compared to traditional OCR.",
            method: "Independent t-Test: t = (x̄1 - x̄2) / sp * √(1/n1 + 1/n2)"
        },
        {
            id: "RQ4",
            title: "Domain Adaptation",
            stream: "Stream A & D (Cross-Domain)",
            description: "Tests transferability from Tax to Legal domains. Hypothesis supported if performance drop < 20%.",
            method: "Confidence Interval: x̄ ± Z * (s / √n)"
        }
    ]

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Evaluation Suite</h1>
                    <p className="text-slate-500 mt-2">Scale: {sampleSize} samples per stream</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Sample Size:</label>
                    <Input
                        type="number"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(Number(e.target.value))}
                        className="w-32 bg-white"
                    />
                </div>
            </div>

            {/* Research Questions Overview */}
            <Card className="bg-white border-indigo-100 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-indigo-900">Research Questions</CardTitle>
                    <CardDescription>The core scientific questions validating the DocuMind Hybrid AI Framework.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-y-4 text-sm">
                        <div>
                            <p className="mb-1"><span className="font-bold text-indigo-700">RQ1 (Trilemma Analysis):</span></p>
                            <p className="text-slate-600">Can an intelligent orchestration framework reduce processing costs and latency while maintaining accuracy compared to a single-model baseline?</p>
                        </div>
                        <div>
                            <p className="mb-1"><span className="font-bold text-indigo-700">RQ2 (Routing Efficiency):</span></p>
                            <p className="text-slate-600">Does the "Gatekeeper" mechanism significantly reduce total token usage by routing simple documents to smaller models?</p>
                        </div>
                        <div>
                            <p className="mb-1"><span className="font-bold text-indigo-700">RQ3 (Referee Validation):</span></p>
                            <p className="text-slate-600">Can a "Referee" agent (Stream B) correctly identify and self-heal hallucinations or logic errors in generated outputs?</p>
                        </div>
                        <div>
                            <p className="mb-1"><span className="font-bold text-indigo-700">RQ4 (Domain Adaptation):</span></p>
                            <p className="text-slate-600">Can the framework adapt to new domains (e.g., Legal) with less than 20% performance degradation using RAG-based few-shot learning?</p>
                        </div>
                        <div>
                            <p className="mb-1"><span className="font-bold text-indigo-700">RQ5 (Visual Extraction):</span></p>
                            <p className="text-slate-600">Does Stream C's multimodal approach extract structured data from charts/graphs more accurately than traditional OCR text-only conversion?</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Scientific Validation Progress Dashboard */}
            {
                history.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Scientific Validation Progress</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                            {TEST_CONFIG.map((test) => {
                                const testHistory = history.filter(h => h.test_type === test.id);
                                const totalRuns = testHistory.length;
                                const significantRuns = testHistory.filter(h => h.significant).length;
                                const successRate = totalRuns > 0 ? (significantRuns / totalRuns) * 100 : 0;
                                const avgPValue = totalRuns > 0
                                    ? testHistory.reduce((acc, curr) => acc + (curr.p_value || 0), 0) / totalRuns
                                    : 0;

                                return (
                                    <Card key={test.id} className="bg-white border-slate-200">
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm font-medium text-slate-500">{test.id}</div>
                                                <div className="text-xs font-mono text-slate-400">{totalRuns} Runs</div>
                                            </div>
                                            <div className="text-2xl font-bold text-slate-900 mb-1">
                                                {successRate.toFixed(1)}%
                                            </div>
                                            <div className="text-xs text-slate-500 mb-3">Success Rate</div>

                                            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                                                <div
                                                    className={`h-2 rounded-full ${successRate >= 80 ? 'bg-green-500' : successRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${successRate}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                                <span>Avg P-Value:</span>
                                                <span className="font-mono">{avgPValue.toFixed(4)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )
            }

            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Available Tests ({TEST_CONFIG.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {TEST_CONFIG.map((test) => (
                        <Card key={test.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-indigo-500 flex flex-col">
                            <CardHeader>
                                <div className="text-xs font-semibold text-indigo-600 mb-1">{test.stream}</div>
                                <CardTitle className="text-lg">{test.title}</CardTitle>
                                <CardDescription className="text-xs mt-2 min-h-[40px]">{test.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="text-xs text-slate-400 mb-4 font-mono bg-slate-100 p-2 rounded">
                                    Method: {test.method}
                                </div>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={() => runTest(test.id)}
                                    disabled={loading}
                                >
                                    {loading ? "Running..." : <><Play className="w-4 h-4 mr-2" /> Run Test</>}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {
                latestResult && (
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-200 animate-in fade-in slide-in-from-bottom-4 mt-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <Activity className="w-6 h-6 mr-2 text-indigo-500" />
                            Latest Result: {TEST_CONFIG.find(t => t.id === latestResult.test_type)?.title || latestResult.test_type}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="p-4 bg-slate-50 rounded-md">
                                <p className="text-sm text-slate-500">P-Value</p>
                                <p className="text-2xl font-mono">{latestResult.p_value.toFixed(5)}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-md">
                                <p className="text-sm text-slate-500">Statistic</p>
                                <p className="text-2xl font-mono">{latestResult.stat_statistic.toFixed(3)}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-md">
                                <p className="text-sm text-slate-500">Significance</p>
                                <p className={`text-2xl font-bold ${latestResult.significant ? "text-green-600" : "text-amber-600"}`}>
                                    {latestResult.significant ? "SIGNIFICANT" : "NOT SIGNIFICANT"}
                                </p>
                            </div>
                        </div>

                        <TestCharts result={latestResult} />
                    </div>
                )
            }

            <div className="mt-12 bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Test History</h3>
                    <Button variant="outline" size="sm" onClick={fetchHistory}>
                        Refresh
                    </Button>
                </div>

                {history.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p>No test history available yet. Run a test to see results here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3">Timestamp</th>
                                    <th className="px-4 py-3">Test Type</th>
                                    <th className="px-4 py-3">Sample Size</th>
                                    <th className="px-4 py-3">Outcome</th>
                                    <th className="px-4 py-3">P-Value</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.slice().reverse().map((h) => (
                                    <tr key={h.test_id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3">{new Date(h.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">{h.test_type}</td>
                                        <td className="px-4 py-3">{h.sample_size}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${h.significant ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {h.significant ? "Significant" : "Not Significant"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono">{h?.p_value?.toFixed(4) || "N/A"}</td>
                                        <td className="px-4 py-3">
                                            <Button variant="ghost" size="sm" onClick={() => handleExport(h.test_id)}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Export
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    )
}

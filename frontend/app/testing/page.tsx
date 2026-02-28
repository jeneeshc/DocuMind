"use client"

import React, { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Zap, CheckCircle, FileSearch, ShieldAlert, Cpu, Coins } from "lucide-react"

// Dynamically import Recharts to avoid Next.js SSR Hydration Mismatch
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const RechartsTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })
const Scatter = dynamic(() => import('recharts').then(mod => mod.Scatter), { ssr: false })
const ComposedChart = dynamic(() => import('recharts').then(mod => mod.ComposedChart), { ssr: false })

function calculateMean(data: any[], groupField: string, valueField: string) {
    const groups: Record<string, number[]> = {};
    data.forEach(row => {
        const g = row[groupField];
        const v = row[valueField];
        if (g != null && v != null) {
            if (!groups[g]) groups[g] = [];
            groups[g].push(v);
        }
    });
    return Object.keys(groups).map(g => {
        const arr = groups[g];
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return { name: g, [valueField]: Number(mean.toFixed(4)) };
    });
}

function computeF2Metrics(data: any[], predCol: string, trueCol: string) {
    let tp = 0, fp = 0, fn = 0;
    data.forEach(row => {
        const p = row[predCol];
        const t = row[trueCol];
        if (p === 1 && t === 1) tp++;
        if (p === 1 && t === 0) fp++;
        if (p === 0 && t === 1) fn++;
    });
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f2 = (precision + recall) === 0 ? 0 : (5 * precision * recall) / (4 * precision + recall);
    return { Precision: Number(precision.toFixed(3)), Recall: Number(recall.toFixed(3)), F2: Number(f2.toFixed(3)) };
}

export default function EvaluationSuitePage() {
    const [data, setData] = useState<{ rq1: any[], rq2: any[], rq3: any[], rq4: any[] }>({ rq1: [], rq2: [], rq3: [], rq4: [] })
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/results')
                const json = await res.json()
                setData(json)
                setLoading(false)
            } catch (e) {
                console.error("Failed to fetch results", e)
            }
        }

        // Initial fetch
        fetchData()

        // Poll every 5 seconds for live updates
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [])

    const { rq1, rq2, rq3, rq4 } = data

    // --- RQ1 Processing ---
    const rq1Stats = useMemo(() => {
        if (rq1.length === 0) return { accuracy: [], cost: [], time: [] };
        return {
            accuracy: calculateMean(rq1, 'group', 'accuracy'),
            cost: calculateMean(rq1, 'group', 'cost'),
            time: calculateMean(rq1, 'group', 'time')
        };
    }, [rq1]);

    // --- RQ2 Processing ---
    const rq2CostComparison = useMemo(() => {
        if (rq2.length === 0) return [];
        const groups: Record<string, { baseline: number[], cascade: number[] }> = {};
        rq2.forEach(d => {
            const cat = d.category;
            if (cat && d.baseline_cost != null && d.cascade_cost != null) {
                if (!groups[cat]) groups[cat] = { baseline: [], cascade: [] };
                groups[cat].baseline.push(d.baseline_cost);
                groups[cat].cascade.push(d.cascade_cost);
            }
        });

        return Object.keys(groups).map(cat => {
            const b = groups[cat].baseline;
            const c = groups[cat].cascade;
            const avgB = b.reduce((a, v) => a + v, 0) / b.length;
            const avgC = c.reduce((a, v) => a + v, 0) / c.length;

            return {
                category: cat.replace('_', ' '),
                "Baseline API": Number(avgB.toFixed(3)),
                "Hybrid Cascade": Number(avgC.toFixed(3)),
            };
        });
    }, [rq2]);

    // --- RQ3 Processing ---
    const rq3Metrics = useMemo(() => {
        if (rq3.length === 0) return [];
        const refM = computeF2Metrics(rq3, 'referee_pred', 'true_label');
        const baseM = computeF2Metrics(rq3, 'baseline_pred', 'true_label');
        return [
            { Metric: "Precision", Referee: refM.Precision, Baseline: baseM.Precision },
            { Metric: "Recall", Referee: refM.Recall, Baseline: baseM.Recall },
            { Metric: "F2 Score", Referee: refM.F2, Baseline: baseM.F2 },
        ];
    }, [rq3]);

    // --- RQ4 Processing ---
    const rq4Box = useMemo(() => {
        if (rq4.length === 0) return [];
        const groups: Record<string, number[]> = {};
        rq4.forEach(d => {
            if (d.domain && d.f1_score != null) {
                if (!groups[d.domain]) groups[d.domain] = [];
                groups[d.domain].push(d.f1_score);
            }
        });

        return Object.keys(groups).map(domain => {
            const arr = groups[domain];
            const sorted = [...arr].sort((a, b) => a - b);
            const min = sorted[0];
            const max = sorted[sorted.length - 1];
            const mean = arr.reduce((a, b) => a + b, 0) / arr.length;

            return {
                domain,
                min: Number(min?.toFixed(3)),
                mean: Number(mean?.toFixed(3)),
                max: Number(max?.toFixed(3)),
            };
        });
    }, [rq4]);


    if (!mounted || loading) {
        return <div className="flex h-screen items-center justify-center p-8 bg-slate-50">
            <div className="flex flex-col items-center">
                <Activity className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-lg text-slate-600 font-medium">Initializing Live Evaluation Suite...</p>
            </div>
        </div>
    }

    return (
        <div className="p-4 md:p-8 space-y-12 bg-slate-50 min-h-screen text-slate-900 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                        <Activity className="h-8 w-8 text-indigo-600" />
                        Live Evaluation Suite
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        DocuMind Hybrid Validation Dashboards (Auto-syncs with backend orchestrator)
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-full text-sm font-semibold shadow-sm">
                    <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    Live Sync Active
                </div>
            </div>

            {/* RQ1: The Trilemma */}
            <section className="space-y-6">
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                        <Cpu className="h-6 w-6 text-blue-600" /> RQ1: The Trilemma (Accuracy, Cost, Latency)
                    </h2>
                    <p className="text-slate-600 max-w-4xl leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        This section evaluates the core hypothesis of the Hybrid Framework. Traditional LLM pipelines suffer from high abstraction costs when determining logic structure. Here, we continuously compare the Hybrid Cascade Orchestrator against a pure Baseline LLM for extracting exact data. As empirical data flows in, we hypothesize the Hybrid framework achieves near-identical high accuracy at a fraction of the cost and time footprint.
                    </p>
                </div>

                {rq1.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-md transition-shadow border-slate-200">
                            <CardHeader><CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Extraction Accuracy (%)</CardTitle></CardHeader>
                            <CardContent className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={rq1Stats.accuracy} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                        <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="accuracy" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow border-slate-200">
                            <CardHeader><CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Processing Cost per Doc ($)</CardTitle></CardHeader>
                            <CardContent className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={rq1Stats.cost} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                        <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="cost" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow border-slate-200">
                            <CardHeader><CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Pipeline Latency (s)</CardTitle></CardHeader>
                            <CardContent className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={rq1Stats.time} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                        <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="time" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500 animate-pulse">
                        Waiting on Orchestrator... No RQ1 Data Found
                    </div>
                )}
            </section>

            <hr className="border-slate-200" />

            {/* RQ2: Cost Optimization */}
            <section className="space-y-6">
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                        <Coins className="h-6 w-6 text-purple-600" /> RQ2: Routing Cost Efficiency
                    </h2>
                    <p className="text-slate-600 max-w-4xl leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        This evaluates the gating efficiency of the Multi-Modal Gatekeeper by charting the absolute expenditure (USD) between document formats. A traditional baseline forces all unstructured documents indiscriminately through a costly Azure Document Intelligence OCR API. Our Hybrid framework successfully intercepts digital-native documents upstream, dynamically routing them towards computationally inexpensive local extractions, establishing a massive cost delta without losing accuracy.
                    </p>
                </div>

                {rq2.length > 0 ? (
                    <Card className="hover:shadow-md transition-shadow border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-700">Average Processing Cost per Document ($)</CardTitle>
                            <CardDescription>Comparing Universal Azure OCR (Baseline) vs Dynamic Gatekeeper Routing</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={rq2CostComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 14, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Baseline API" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Hybrid Cascade" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500 animate-pulse">
                        Waiting on Orchestrator... No RQ2 Data Found
                    </div>
                )}
            </section>

            <hr className="border-slate-200" />

            {/* RQ3: Referee Validation */}
            <section className="space-y-6">
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                        <ShieldAlert className="h-6 w-6 text-teal-600" /> RQ3: Self-Healing & Referee Validations
                    </h2>
                    <p className="text-slate-600 max-w-4xl leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        How highly can we trust autonomous AI? This section tests the "Referee" Agent's structural ability to catch hallucinations visually when verifying invoices against the FUTURA dataset. By plotting <strong>F2-Scores</strong> instead of accuracy, we intentionally heavily weigh <em>Recall</em>, verifying the agent errors on the side of caution rather than letting faulty logic pass.
                    </p>
                </div>

                {rq3.length > 0 ? (
                    <Card className="hover:shadow-md transition-shadow border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-700">Referee Output vs Baseline Accuracy (Binary Error Classification)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={rq3Metrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="Metric" tick={{ fill: '#64748b', fontSize: 14, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 1.0]} tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Referee" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Baseline" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500 animate-pulse">
                        Waiting on Orchestrator... No RQ3 Data Found
                    </div>
                )}
            </section>

            <hr className="border-slate-200" />

            {/* RQ4: Domain Adaptation */}
            <section className="space-y-6">
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                        <FileSearch className="h-6 w-6 text-rose-600" /> RQ4: Zero-Shot Domain Transferability
                    </h2>
                    <p className="text-slate-600 max-w-4xl leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                        The ultimate test of a generalized orchestrator. Tests if the system can generalize to completely new datasets (Healthcare, Legal Contracts vs. Baseline Tax Forms) without re-training models. Testing the hypothesis that the performance (Macro F1-Score) drop should not exceed roughly 20% when facing novel schema.
                    </p>
                </div>

                {rq4.length > 0 ? (
                    <Card className="hover:shadow-md transition-shadow border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-700">Domain Adaptation Performance Distribution (F1 Score)</CardTitle>
                            <CardDescription>Measuring variance in extracting complex key-pairs</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={rq4Box} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="domain" tick={{ fill: '#64748b', fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 1.0]} tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                    <Bar dataKey="mean" fill="#818cf8" name="Mean F1 Score" radius={[6, 6, 0, 0]} barSize={80} />
                                    <Scatter dataKey="min" fill="#ef4444" name="Minimum F1 Detected" />
                                    <Scatter dataKey="max" fill="#22c55e" name="Maximum F1 Detected" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500 animate-pulse">
                        Waiting on Orchestrator... No RQ4 Data Found
                    </div>
                )}
            </section>

        </div>
    )
}

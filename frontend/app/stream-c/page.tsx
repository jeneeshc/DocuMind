"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Loader2, Play, LayoutGrid } from "lucide-react"
import axios from "axios"

export default function StreamCPage() {
    const [file, setFile] = useState<File | null>(null)
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [mode, setMode] = useState<"autonomous" | "direct">("direct")
    const [uploaderKey, setUploaderKey] = useState(0)

    const handleReset = () => {
        setFile(null)
        setQuery("")
        setResult(null)
        setUploaderKey(prev => prev + 1)
    }

    const handleProcess = async () => {
        if (!file) return
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", file)
        if (query) formData.append("query", query)

        const endpoint = mode === "autonomous"
            ? "http://localhost:8000/api/v1/process/orchestrate"
            : "http://localhost:8000/api/v1/process/stream-c"

        try {
            const response = await axios.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setResult(response.data)
        } catch (error) {
            console.error(error)
            setResult({ status: "error", message: "Failed to process request" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-8 h-full space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
                    <div className="p-2 bg-zinc-800 rounded-lg mr-3">
                        <BrainCircuit className="w-6 h-6 text-zinc-200" />
                    </div>
                    Stream C: Visual Extraction
                </h2>
                <p className="text-gray-400 mt-2">
                    Direct Stream Onboarding: Extract structured entities from semi-structured or complex visual documents.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Orchestration Mode</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setMode("direct")}
                                        className={`py-2 px-3 text-xs rounded-md border transition ${mode === "direct" ? "bg-zinc-700 border-zinc-500 text-white" : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"}`}
                                    >
                                        Direct (Cost-Opt)
                                    </button>
                                    <button
                                        onClick={() => setMode("autonomous")}
                                        className={`py-2 px-3 text-xs rounded-md border transition ${mode === "autonomous" ? "bg-blue-900/40 border-blue-500 text-white" : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"}`}
                                    >
                                        Autonomous (Gatekeeper)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">1. Upload Visual Document</label>
                                <FileUploader
                                    key={uploaderKey}
                                    onFileSelect={setFile}
                                    accept=".pdf, .png, .jpg, .jpeg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">2. Extraction Query (Optional)</label>
                                <input
                                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm text-white placeholder:text-gray-500"
                                    placeholder="e.g., 'Extract itemized table'"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleReset}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition border border-gray-700"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleProcess}
                                    disabled={!file || isLoading}
                                    className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {mode === "autonomous" ? "Orchestrating..." : "Extracting..."}
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            {mode === "autonomous" ? "Run Orchestrator" : "Run Extraction"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full min-h-[400px] bg-gray-800 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle>Extraction Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!result ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
                                    <LayoutGrid className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Structured data will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg text-sm ${result.status === "success" ? "bg-zinc-900 text-white border border-zinc-700" : "bg-red-950/30 text-red-200 border border-red-900/50"}`}>
                                        <strong>Status:</strong> {result.status}
                                        {result.stream_used && <span className="ml-2 px-2 py-0.5 bg-blue-900 text-blue-100 text-[10px] rounded uppercase">Routed: Stream {result.stream_used}</span>}
                                        <br />
                                        {result.message}
                                    </div>

                                    {result.data?.data && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500">Visual Entities (JSON)</label>
                                            <pre className="p-4 bg-gray-900 text-gray-100 rounded-md text-xs overflow-x-auto border border-gray-700">
                                                <code>{JSON.stringify(result.data.data, null, 2)}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2, Play, Search } from "lucide-react"
import axios from "axios"

export default function StreamDPage() {
    const [file, setFile] = useState<File | null>(null)
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [uploaderKey, setUploaderKey] = useState(0)

    const handleReset = () => {
        setFile(null)
        setQuery("")
        setResult(null)
        setUploaderKey(prev => prev + 1)
    }

    const handleProcess = async () => {
        if (!file || !query) return
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("query", query)

        try {
            const response = await axios.post("http://localhost:8000/api/v1/process/stream-d", formData, {
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
                    <div className="p-2 bg-slate-900 rounded-lg mr-3">
                        <Database className="w-6 h-6 text-slate-200" />
                    </div>
                    Stream D: Semantic Pruning
                </h2>
                <p className="text-gray-400 mt-2">
                    Intelligent RAG for large unstructured contracts and agreements.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle>Semantic Query</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">1. Upload Unstructured Document</label>
                                <FileUploader
                                    key={uploaderKey}
                                    onFileSelect={setFile}
                                    accept=".pdf, .txt, .docx"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">2. Natural Language Query</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        className="w-full p-3 pl-10 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-white placeholder:text-gray-500"
                                        placeholder="e.g., 'What are the termination clauses?'"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>
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
                                    disabled={!file || !query || isLoading}
                                    className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Pruning Context...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Search Document
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
                            <CardTitle>Analysis Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!result ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
                                    <Search className="w-12 h-12 mb-4 opacity-20" />
                                    <p>AI insights will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg text-sm ${result.status === "success" ? "bg-zinc-900 text-white border border-zinc-700" : "bg-red-950/30 text-red-200 border border-red-900/50"}`}>
                                        <strong>Status:</strong> {result.status}
                                        <br />
                                        {result.message}
                                    </div>

                                    {result.data?.answer && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500">AI Response</label>
                                            <div className="p-4 bg-gray-900 text-gray-100 rounded-md text-sm leading-relaxed border border-gray-700">
                                                {result.data.answer}
                                            </div>
                                        </div>
                                    )}

                                    {result.data?.relevant_context_snippets && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500">Pruned Context Snippets</label>
                                            <div className="space-y-2">
                                                {result.data.relevant_context_snippets.map((snippet: string, i: number) => (
                                                    <div key={i} className="p-3 bg-gray-700/30 rounded border border-gray-700 text-xs italic text-gray-300">
                                                        "...{snippet}..."
                                                    </div>
                                                ))}
                                            </div>
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

"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2, Play } from "lucide-react"
import axios from "axios"

export default function StreamAPage() {
    const [file, setFile] = useState<File | null>(null)
    const [instruction, setInstruction] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [uploaderKey, setUploaderKey] = useState(0)

    const handleReset = () => {
        setFile(null)
        setInstruction("")
        setResult(null)
        setDownloadUrl(null)
        setUploaderKey(prev => prev + 1)
    }

    const handleProcess = async () => {
        if (!file || !instruction) return
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("instruction", instruction)

        try {
            const response = await axios.post("http://localhost:8000/api/v1/process/stream-a", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setResult(response.data)
            if (response.data.data?.result_id) {
                setDownloadUrl(`http://localhost:8000/api/v1/download/${response.data.data.result_id}`)
            }
        } catch (error: any) {
            console.error("Upload Error:", error)
            const errorMsg = error.response?.data?.detail || error.message || "Failed to process request"
            setResult({ status: "error", message: `Connection Error: ${errorMsg}. Ensure backend is running at http://localhost:8000` })
            setDownloadUrl(null)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-8 h-full space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
                    <div className="p-2 bg-slate-800 rounded-lg mr-3">
                        <Database className="w-6 h-6 text-white" />
                    </div>
                    Digital Data Transformation
                </h2>
                <p className="text-gray-400 mt-2">
                    Upload structured data (CSV, Excel) and provide plain English instructions to transform it.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle>Input Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">1. Upload Dataset</label>
                                <FileUploader
                                    key={uploaderKey}
                                    onFileSelect={setFile}
                                    accept=".csv, .xlsx, application/vnd.ms-excel"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">2. Transformation Instruction</label>
                                <textarea
                                    className="w-full min-h-[120px] p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-white placeholder:text-gray-500"
                                    placeholder="e.g., 'Normalize all phone numbers to E.164 format and filter rows where 'Status' is 'Active'.'"
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
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
                                    disabled={!file || !instruction || isLoading}
                                    className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Synthesizing Logic...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Generate & Execute
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
                            <CardTitle>Results & Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!result ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
                                    <Database className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Output will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg text-sm ${result.status === "success" ? "bg-zinc-900 text-white border border-zinc-700" : "bg-red-950/30 text-red-200 border border-red-900/50"}`}>
                                        <strong>Status:</strong> {result.status}
                                        <br />
                                        {result.message}
                                        {downloadUrl && (
                                            <div className="mt-4">
                                                <a
                                                    href={downloadUrl}
                                                    download
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition"
                                                >
                                                    <Play className="w-3 h-3 mr-2 rotate-90" />
                                                    Download Full Dataset (CSV)
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {result.data?.generated_code && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500">Generated Logic</label>
                                            <pre className="p-3 bg-gray-900 text-gray-100 rounded-md text-xs overflow-x-auto">
                                                <code>{result.data.generated_code}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {result.data?.preview && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500">Data Preview (Top 10)</label>
                                            <div className="border border-gray-700 rounded-md overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs text-left">
                                                        <thead className="bg-gray-700/50 border-b border-gray-700">
                                                            <tr>
                                                                {Object.keys(result.data.preview[0]).map((key) => (
                                                                    <th key={key} className="p-2 font-medium text-gray-300">{key}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-700">
                                                            {result.data.preview.map((row: any, i: number) => (
                                                                <tr key={i} className="hover:bg-gray-700/50">
                                                                    {Object.values(row).map((val: any, j: number) => (
                                                                        <td key={j} className="p-2 truncate max-w-[150px]">{String(val)}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
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

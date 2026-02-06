"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"
import { Button } from "@/components/ui/button" // Assuming standard generic button or I'll implement inline
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2, Play } from "lucide-react"
import axios from "axios"

export default function StreamAPage() {
    const [file, setFile] = useState<File | null>(null)
    const [instruction, setInstruction] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

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
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3">
                        <Database className="w-6 h-6 text-violet-600" />
                    </div>
                    Digital Data Transformation
                </h2>
                <p className="text-gray-500 mt-2">
                    Upload structured data (CSV, Excel) and provide plain English instructions to transform it.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">1. Upload Dataset</label>
                                <FileUploader
                                    onFileSelect={setFile}
                                    accept=".csv, .xlsx, application/vnd.ms-excel"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">2. Transformation Instruction</label>
                                <textarea
                                    className="w-full min-h-[120px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                                    placeholder="e.g., 'Normalize all phone numbers to E.164 format and filter rows where 'Status' is 'Active'.'"
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleProcess}
                                disabled={!file || !instruction || isLoading}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full min-h-[400px]">
                        <CardHeader>
                            <CardTitle>Results & Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!result ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                                    <Database className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Output will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg text-sm ${result.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                        <strong>Status:</strong> {result.status}
                                        <br />
                                        {result.message}
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
                                            <div className="border rounded-md overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs text-left">
                                                        <thead className="bg-gray-100 border-b">
                                                            <tr>
                                                                {Object.keys(result.data.preview[0]).map((key) => (
                                                                    <th key={key} className="p-2 font-medium text-gray-600">{key}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {result.data.preview.map((row: any, i: number) => (
                                                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
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

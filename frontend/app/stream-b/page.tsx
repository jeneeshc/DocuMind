"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanLine, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import axios from "axios"

export default function StreamBPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleProcess = async () => {
        if (!file) return
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await axios.post("http://localhost:8000/api/v1/process/stream-b", formData, {
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
                    <div className="p-2 bg-pink-100 rounded-lg mr-3">
                        <ScanLine className="w-6 h-6 text-pink-700" />
                    </div>
                    Structured Document Intelligence
                </h2>
                <p className="text-gray-500 mt-2">
                    Upload fixed-layout forms (invoices, tax forms). The system will auto-correct extraction errors.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Upload</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Form (PDF/Image)</label>
                                <FileUploader
                                    onFileSelect={setFile}
                                    accept=".pdf, .jpg, .png, .jpeg"
                                />
                            </div>

                            <button
                                onClick={handleProcess}
                                disabled={!file || isLoading}
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analyzing Layout...
                                    </>
                                ) : (
                                    <>
                                        <ScanLine className="w-4 h-4 mr-2" />
                                        Extract Data
                                    </>
                                )}
                            </button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full min-h-[400px]">
                        <CardHeader>
                            <CardTitle>Extraction Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!result ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                                    <ScanLine className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Extraction results will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {result.data?.healing_report && (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="flex items-center text-amber-800 font-semibold mb-2">
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Self-Healing Triggered
                                            </div>
                                            <p className="text-xs text-amber-700">
                                                The system detected missing fields: <strong>{result.data.healing_report.healed_fields?.join(", ")}</strong>.
                                                <br />
                                                Logic Applied: {result.data.healing_report.logic}
                                            </p>
                                        </div>
                                    )}

                                    {result.data?.extracted && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(result.data.extracted).map(([key, value]) => (
                                                <div key={key} className="p-3 bg-gray-50 rounded border">
                                                    <div className="text-xs text-gray-500 uppercase font-semibold">{key}</div>
                                                    <div className="font-medium text-gray-900 break-words">
                                                        {String(value)}
                                                        {result.data.healing_report?.healed_fields?.includes(key) && (
                                                            <CheckCircle className="w-3 h-3 text-green-500 inline ml-2" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
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

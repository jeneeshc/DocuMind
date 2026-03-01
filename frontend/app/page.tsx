"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, UploadCloud, FileType, CheckCircle2, Loader2, Activity } from "lucide-react"
import { RequirementBuilder } from "@/components/RequirementBuilder"

export default function DataTransformationPage() {
  const [file, setFile] = useState<File | null>(null)
  const [schema, setSchema] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setSchema("") // Reset schema when new file is chosen
      setResult(null)
      setError(null)
    }
  }

  const getDocType = (fileName: string): "tabular" | "document" | null => {
    if (!fileName) return null;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') return 'tabular';
    return 'document';
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setSchema("")
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (schema) {
      formData.append("extraction_schema", schema);
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/process/orchestrate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 h-full min-h-screen bg-slate-50">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Data Transformation</h2>
        <p className="text-muted-foreground text-slate-600 text-lg">
          Autonomous engine for dynamic data transformation
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* L/H Side: Upload & Configure */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <UploadCloud className="w-5 h-5 mr-3 text-blue-500" />
                Universal Document Ingestion
              </CardTitle>
              <CardDescription className="text-slate-500">
                Drag and drop PDFs, Images, or CSVs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${file ? 'border-emerald-500/50 bg-emerald-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {file ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-emerald-100 rounded-full">
                      <FileType className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-900">{file.name}</h3>
                      <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-xs text-rose-500 hover:text-rose-600 underline"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-slate-100 rounded-full">
                      <UploadCloud className="w-10 h-10 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-700">Click or drag file to this area</h3>
                      <p className="text-sm text-slate-500 mt-1">Supports .pdf, .png, .jpg, .csv, .xlsx</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Requirement Builder appears once a file is selected */}
          {file && (
            <RequirementBuilder
              fileType={getDocType(file.name)}
              onChange={setSchema}
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || isProcessing}
            className={`w-full py-4 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm transition-all ${!file
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200'
              }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                DocuMind Routing...
              </>
            ) : (
              <>
                <BrainCircuit className="w-6 h-6 mr-3" />
                Submit to DocuMind
              </>
            )}
          </button>
        </div>

        {/* R/H Side: Results & Observability */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 h-full shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center text-slate-900">
                <Activity className="w-5 h-5 mr-3 text-purple-500" />
                Pipeline Observability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">

              {!isProcessing && !result && !error && (
                <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 space-y-4">
                  <BrainCircuit className="w-16 h-16 opacity-30" />
                  <p>Awaiting payload submission.</p>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center h-[400px] text-blue-500 space-y-6">
                  <Loader2 className="w-16 h-16 animate-spin opacity-80" />
                  <div className="text-center">
                    <p className="font-medium text-lg text-slate-700">Analyzing Document Morphology...</p>
                    <p className="text-sm text-slate-500 mt-2">Engaging Hybrid Architecture</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <h3 className="text-rose-600 font-bold mb-2">Pipeline Error</h3>
                  <p className="text-sm text-slate-600">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mr-4" />
                    <div>
                      <h3 className="text-emerald-700 font-bold">Extraction Successful</h3>
                      <p className="text-sm text-slate-600">
                        Routed via <strong className="text-slate-900">Stream {result.stream_used}: {
                          result.stream_used === "A" ? "Logic Synthesis" :
                            result.stream_used === "B" ? "Self-Healing" :
                              result.stream_used === "C" ? "Visual Extraction" :
                                result.stream_used === "D" ? "Semantic Pruning" : "Unknown"
                        }</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 overflow-auto max-h-[500px]">
                    <h4 className="text-xs uppercase text-slate-500 font-bold mb-3 tracking-wider">Extracted Payload</h4>
                    <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { FileUploader } from "@/components/FileUploader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Loader2, Send } from "lucide-react"
import axios from "axios"

export default function StreamCPage() {
    const [file, setFile] = useState<File | null>(null)
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, context?: any }[]>([])

    const handleSend = async () => {
        if (!file || !query) return

        const userMsg = query
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setQuery("")
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("query", userMsg)

        try {
            const response = await axios.post("http://localhost:8000/api/v1/process/stream-c", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            const answer = response.data.data?.answer || "No answer generated." // Check data path
            const context = response.data.data?.relevant_context_snippets

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: answer,
                context: context
            }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Error: Failed to process query." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-8 h-full space-y-8 flex flex-col max-h-screen">
            <div className="flex-none">
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
                    <div className="p-2 bg-slate-700/50 rounded-lg mr-3">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    Semantic Text Analysis
                </h2>
                <p className="text-gray-400 mt-2">
                    Chat with unstructured documents (Contracts, MSAs). The system retrieves specific pages to answer questions.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 flex-1 overflow-hidden min-h-[500px]">
                {/* Left Panel: Upload */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-gray-800 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle>Document Context</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Select Document</label>
                                <FileUploader
                                    onFileSelect={setFile}
                                    accept=".pdf, .docx, .txt"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: Chat */}
                <div className="md:col-span-2 flex flex-col h-full">
                    <Card className="flex flex-col h-full border-none shadow-none bg-transparent">
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 rounded-t-xl border border-gray-700 border-b-0 min-h-[400px]">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Ask a question about your document</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                            ? 'bg-white text-black rounded-br-none'
                                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>

                                            {msg.context && (
                                                <div className="mt-4 pt-3 border-t border-white/10">
                                                    <p className="text-xs font-semibold mb-1 opacity-70">Source Context:</p>
                                                    <div className="text-xs opacity-70 italic max-h-20 overflow-y-auto">
                                                        "... {msg.context[0].substring(0, 200)} ..."
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>

                        <div className="p-4 bg-gray-800 border border-t-0 border-gray-700 rounded-b-xl flex items-center gap-2">
                            <input
                                className="flex-1 p-3 bg-gray-900 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm placeholder:text-gray-500"
                                placeholder="Ask a question..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={!file}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!file || !query || isLoading}
                                className="p-3 bg-white hover:bg-gray-200 text-black rounded-full transition disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

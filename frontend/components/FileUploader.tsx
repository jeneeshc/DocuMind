"use client"

import { useState, useRef } from "react"
import { UploadCloud, File, X } from "lucide-react"

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    accept?: string;
}

export function FileUploader({ onFileSelect, accept }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        setSelectedFile(file)
        onFileSelect(file)
    }

    const removeFile = () => {
        setSelectedFile(null)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    const onButtonClick = () => {
        inputRef.current?.click()
    }

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleChange}
            />

            {!selectedFile ? (
                <div
                    className={`h-40 w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${dragActive ? "border-white bg-white/5" : "border-gray-600 bg-gray-800/50 hover:bg-gray-800"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                >
                    <UploadCloud className={`w-10 h-10 mb-2 ${dragActive ? "text-white" : "text-gray-400"}`} />
                    <p className="text-sm font-medium text-gray-300">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {accept ? `Accepted: ${accept}` : "Any file"}
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-gray-800 border-gray-700 border rounded-xl shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-white/10 rounded-lg mr-3">
                            <File className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                            <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-1 hover:bg-gray-700 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            )
            }
        </div >
    )
}

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, ListPlus } from "lucide-react";

interface RequirementBuilderProps {
    fileType: "tabular" | "document" | null;
    onChange: (schema: string) => void;
}

export function RequirementBuilder({ fileType, onChange }: RequirementBuilderProps) {
    // For tabular data
    const [instruction, setInstruction] = useState<string>("");

    // For document data (PDF/Image)
    const [fields, setFields] = useState<string[]>([]);
    const [newField, setNewField] = useState<string>("");

    if (!fileType) return null;

    const handleInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInstruction(val);
        onChange(JSON.stringify({ type: "transformation", instruction: val }));
    };

    const addField = () => {
        if (newField.trim() && !fields.includes(newField.trim())) {
            const updatedFields = [...fields, newField.trim()];
            setFields(updatedFields);
            setNewField("");
            onChange(JSON.stringify({ type: "extraction", fields: updatedFields }));
        }
    };

    const removeField = (fieldToRemove: string) => {
        const updatedFields = fields.filter((f) => f !== fieldToRemove);
        setFields(updatedFields);
        onChange(JSON.stringify({ type: "extraction", fields: updatedFields }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addField();
        }
    };

    return (
        <Card className="bg-gray-800/60 border-gray-700/50 mt-4 shadow-sm w-full">
            <CardContent className="p-4 space-y-4">
                {fileType === "tabular" ? (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-blue-400">Data Transformation Requirements</h4>
                        <p className="text-xs text-gray-400">Describe the logical transformations, grouping, or aggregations you need applied to this dataset.</p>
                        <textarea
                            className="w-full bg-[#0B1121] border border-gray-700 rounded-md p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="e.g., Sum the total sales by Region, filter out nulls, and provide the average Deal Size."
                            rows={3}
                            value={instruction}
                            onChange={handleInstructionChange}
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-emerald-400">Extraction Schema Definition</h4>
                        <p className="text-xs text-gray-400">Define the exact data points you want the AI to extract from this document.</p>

                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="flex-1 bg-[#0B1121] border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                placeholder="e.g., Invoice Number, Total Amount, Supplier Name"
                                value={newField}
                                onChange={(e) => setNewField(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type="button"
                                className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-2 rounded-md flex items-center transition border border-emerald-500/30 text-sm font-medium"
                                onClick={addField}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                        </div>

                        {fields.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-800">
                                <div className="flex items-center mb-2 text-xs text-gray-400 uppercase font-semibold">
                                    <ListPlus className="w-3 h-3 mr-1" />
                                    Target Fields ({fields.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {fields.map((field) => (
                                        <div
                                            key={field}
                                            className="bg-[#0B1121] border border-gray-700 rounded-full px-3 py-1 flex items-center shadow-sm text-sm"
                                        >
                                            <span className="text-gray-300 mr-2">{field}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeField(field)}
                                                className="text-gray-500 hover:text-red-400 transition"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

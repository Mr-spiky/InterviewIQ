"use client";

import { FileText, X, Upload } from "lucide-react";

interface ResumeUploadProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
}

export default function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped && (dropped.type === "application/pdf" || dropped.name.endsWith(".pdf"))) {
            onFileChange(dropped);
        }
    };

    if (file) {
        return (
            <div className="border-3 border-lime bg-lime/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-lime" />
                    <div>
                        <div className="font-grotesk font-bold text-white text-sm">{file.name}</div>
                        <div className="text-white/40 text-xs">{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
                <button onClick={() => onFileChange(null)} className="text-white/40 hover:text-red-400">
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="border-3 border-dashed border-dark-300 hover:border-lime hover:bg-lime/5 p-10 text-center cursor-pointer transition-all duration-200"
        >
            <Upload className="w-10 h-10 text-lime mx-auto mb-3" />
            <p className="font-grotesk font-bold text-white mb-1">Drag & drop your resume</p>
            <p className="text-white/40 text-sm mb-4">PDF format only</p>
            <label className="brutal-btn-primary cursor-pointer text-sm px-5 py-2">
                Browse Files
                <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={e => onFileChange(e.target.files?.[0] || null)}
                />
            </label>
        </div>
    );
}

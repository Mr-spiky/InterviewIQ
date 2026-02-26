"use client";

import { Mic, MicOff, Send, AlertCircle } from "lucide-react";

interface ChatInputProps {
    input: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isMicOn: boolean;
    onToggleMic: () => void;
}

export default function ChatInput({ input, onChange, onSend, isMicOn, onToggleMic }: ChatInputProps) {
    return (
        <div className="border-t-3 border-dark-200 p-4 bg-dark">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <button
                    onClick={onToggleMic}
                    className={`w-12 h-12 border-3 flex items-center justify-center shrink-0 transition-all duration-150 ${isMicOn
                            ? "bg-lime border-dark shadow-brutal-dark text-dark animate-pulse-lime"
                            : "bg-card border-dark-300 text-white/50 hover:border-lime hover:text-lime"
                        }`}
                >
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={e => onChange(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                        placeholder="Type your answer, or use the mic... (Enter to send)"
                        rows={2}
                        className="w-full bg-card border-3 border-dark-300 focus:border-lime text-white text-sm p-4 pr-14 resize-none outline-none transition-colors duration-200 font-inter placeholder:text-white/30"
                    />
                    <button
                        onClick={onSend}
                        disabled={!input.trim()}
                        className="absolute right-3 bottom-3 w-8 h-8 bg-lime border-2 border-dark flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-brutal-dark transition-all duration-150"
                    >
                        <Send className="w-4 h-4 text-dark" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3 text-white/20 text-xs font-grotesk">
                <AlertCircle className="w-3 h-3" />
                Your responses are being analyzed in real-time by the AI
            </div>
        </div>
    );
}

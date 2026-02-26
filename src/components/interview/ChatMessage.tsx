"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export type MessageRole = "ai" | "user";

export interface Message {
    id: number;
    role: MessageRole;
    content: string;
    timestamp: string;
}

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isAi = message.role === "ai";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isAi ? "justify-start" : "justify-end"}`}
        >
            {isAi && (
                <div className="w-8 h-8 bg-lime border-3 border-dark flex items-center justify-center shrink-0 mr-3 mt-1">
                    <Brain className="w-4 h-4 text-dark" />
                </div>
            )}
            <div className={`max-w-[75%] ${isAi ? "items-start" : "items-end"} flex flex-col gap-1`}>
                <div
                    className={`px-5 py-4 border-3 text-sm leading-relaxed font-inter ${isAi
                            ? "bg-card border-lime shadow-brutal text-white"
                            : "bg-lime border-dark shadow-brutal-dark text-dark"
                        }`}
                >
                    {message.content}
                </div>
                <span className="text-white/30 text-[10px] px-1">{message.timestamp}</span>
            </div>
        </motion.div>
    );
}

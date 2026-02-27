"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AuthGuard from "@/components/ui/AuthGuard";
import CameraFeed from "@/components/interview/CameraFeed";
import AIAvatar from "@/components/interview/AIAvatar";
import { interviewApi, sessionsApi, type Session } from "@/lib/api";
import { useSpeechOutput, useSpeechInput } from "@/hooks/useSpeech";
import { Mic, MicOff, PhoneOff, Loader2, Send, Brain } from "lucide-react";

export default function InterviewPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-lime" /></div>}>
                <InterviewContent />
            </Suspense>
        </AuthGuard>
    );
}

function InterviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session");

    const [session, setSession] = useState<Session | null>(null);

    // UI State
    const [elapsed, setElapsed] = useState(0);
    const [initLoading, setInitLoading] = useState(true);
    const [error, setError] = useState("");
    const [questionCount, setQuestionCount] = useState(0);

    // Conversation State
    const [aiCaption, setAiCaption] = useState("Connecting to server...");
    const [userCaption, setUserCaption] = useState("");
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [input, setInput] = useState("");

    const { speak, stop: stopSpeech, isSpeaking: isAiSpeaking } = useSpeechOutput();

    const onUserFinishedSpeaking = useCallback((transcript: string) => {
        if (!transcript.trim()) return;
        sendMessage(transcript);
        setUserCaption(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { startListening, stopListening, isListening, interimTranscript } = useSpeechInput(onUserFinishedSpeaking);

    // Initial Load & Kickoff
    useEffect(() => {
        if (!sessionId) { router.push("/setup"); return; }
        sessionsApi.get(sessionId)
            .then(s => {
                setSession(s);
                kickoffInterview(sessionId);
            })
            .catch(e => setError(e.message))
            .finally(() => setInitLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const kickoffInterview = async (sid: string) => {
        setIsAiProcessing(true);
        try {
            const result = await interviewApi.sendMessage(sid, "Hello, I am ready to begin the interview.");
            setQuestionCount(result.question_count);
            setAiCaption(result.message.content);
            speak(result.message.content);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "AI failed to respond";
            setAiCaption(`⚠️ Could not connect: ${msg}. Try typing below.`);
        } finally {
            setIsAiProcessing(false);
        }
    };

    // Timer
    useEffect(() => {
        const t = setInterval(() => setElapsed(p => p + 1), 1000);
        return () => clearInterval(t);
    }, []);

    // Display transcript or input realtime
    const displayUserText = interimTranscript || input || userCaption;

    const sendMessage = async (content?: string) => {
        const text = (content ?? input).trim();
        if (!text || !sessionId || isAiProcessing) return;

        setInput("");
        setUserCaption(text);
        stopSpeech();
        if (isListening) stopListening();

        setIsAiProcessing(true);
        setAiCaption("Thinking...");

        try {
            const result = await interviewApi.sendMessage(sessionId, text);
            setQuestionCount(result.question_count);
            setAiCaption(result.message.content);
            speak(result.message.content);
        } catch {
            setAiCaption("Failed to get response. Please try again.");
        } finally {
            setIsAiProcessing(false);
        }
    };

    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            stopSpeech();
            startListening();
        }
    };

    const handleEnd = async () => {
        stopSpeech();
        if (isListening) stopListening();
        if (sessionId) await interviewApi.endSession(sessionId).catch(() => { });
        router.push(`/feedback?session=${sessionId}`);
    };

    if (initLoading) {
        return <div className="flex h-screen items-center justify-center bg-dark"><Loader2 className="w-8 h-8 animate-spin text-lime" /></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-dark p-6">
                <div className="bg-dark-200 p-8 border border-red-500/30 rounded max-w-md text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={() => router.push("/setup")} className="px-6 py-2 bg-lime text-dark font-bold hover:bg-lime/90 transition-colors">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden font-grotesk">

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-dark-200 border-b border-dark-300 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-lime flex items-center justify-center">
                        <Brain className="w-5 h-5 text-dark" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold leading-tight tracking-tight uppercase">InterviewIQ <span className="text-dark-400 font-normal">— LIVE SESSION</span></h1>
                        <p className="text-dark-400 text-xs">{session?.role} @ {session?.level}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-300 rounded border border-dark-400 text-sm font-mono text-lime">
                        <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
                        {Math.floor(elapsed / 60).toString().padStart(2, "0")}:{(elapsed % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider">
                        Q: <span className="text-lime">{questionCount}</span>
                    </div>
                </div>
            </header>

            {/* Split Video Call View */}
            <main className="flex-1 flex gap-4 p-4 min-h-0 bg-dark">

                {/* Left Panel: AI Avatar */}
                <div className="flex-1 flex flex-col relative rounded-xl overflow-hidden bg-dark-200 border border-dark-300 shadow-2xl">
                    <AIAvatar isSpeaking={isAiSpeaking} />

                    {/* AI Subtitle Overlay */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={aiCaption}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-6 inset-x-6 z-20 pointer-events-none"
                        >
                            <div className="bg-black/70 backdrop-blur-md border border-dark-300 p-4 rounded-lg shadow-xl max-w-2xl mx-auto">
                                <p className="text-white text-lg leading-relaxed text-center font-medium">
                                    {isAiProcessing ? <span className="animate-pulse text-dark-500">Thinking...</span> : aiCaption}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Panel: User Camera & Input */}
                <div className="w-1/3 flex flex-col gap-4 relative">
                    <div className="flex-1 relative rounded-xl overflow-hidden bg-dark-200 border border-dark-300 shadow-2xl">
                        <CameraFeed isSpeaking={isListening} />

                        {/* User Subtitle Overlay */}
                        <div className="absolute bottom-6 inset-x-6 z-20 pointer-events-none">
                            <div className={`bg-black/70 backdrop-blur-md border p-4 rounded-lg shadow-xl max-w-md mx-auto transition-colors ${isListening ? 'border-lime/50' : 'border-dark-300'}`}>
                                <p className="text-white text-base leading-relaxed text-center font-medium min-h-[1.5rem] italic">
                                    {displayUserText || <span className="text-dark-500 not-italic">Voice transcription appears here...</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Fallback Chat Box */}
                    <div className="shrink-0 p-4 bg-dark-200 border border-dark-300 rounded-xl shadow-lg">
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={toggleMic}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded uppercase font-bold text-sm tracking-wider transition-all shadow-md ${isListening
                                        ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30"
                                        : "bg-lime text-dark hover:bg-lime/90"
                                        }`}
                                >
                                    {isListening ? (
                                        <><MicOff className="w-4 h-4" /> Stop Listening</>
                                    ) : (
                                        <><Mic className="w-4 h-4" /> Speak Answer</>
                                    )}
                                </button>

                                <button
                                    onClick={handleEnd}
                                    className="px-6 py-3 bg-dark-400 text-white border border-dark-500 rounded hover:bg-dark-500 uppercase font-bold text-sm tracking-wider flex items-center gap-2 transition-colors"
                                >
                                    <PhoneOff className="w-4 h-4 text-red-400" />
                                    End
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Or type your fallback answer here..."
                                    disabled={isAiProcessing || isListening}
                                    className="w-full bg-dark bg-opacity-50 border border-dark-400 text-white p-3 pr-12 rounded focus:outline-none focus:border-lime disabled:opacity-50 transition-colors"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isAiProcessing || isListening}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-lime text-dark rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime/90 transition-colors"
                                >
                                    {isAiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


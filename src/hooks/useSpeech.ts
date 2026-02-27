"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * useSpeechOutput — Web Speech API TTS hook.
 * Exposes isSpeaking state and automatically handles TTS.
 */
export function useSpeechOutput() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
            v => v.name.toLowerCase().includes("google uk english male") ||
                v.name.toLowerCase().includes("daniel") ||
                v.name.toLowerCase().includes("alex") ||
                v.lang === "en-US"
        );
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
    }, []);

    // Ensure state resets on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    return { speak, stop, isSpeaking };
}

/**
 * useSpeechInput — Web Speech API STT hook.
 * Now supports continuous listening and interim results.
 */
export function useSpeechInput(onFinalResult: (transcript: string) => void) {
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    const startListening = useCallback(() => {
        const SpeechRecognition =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).SpeechRecognition ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Try Chrome.");
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;

        let finalTranscriptStr = "";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let interim = "";
            let final = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (final) {
                finalTranscriptStr += final + " ";
            }

            setInterimTranscript(interim || finalTranscriptStr);

            // Auto-stop on long pause? Could do that with a timeout.
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (e: any) => {
            console.warn("Speech recognition error:", e.error);
            if (e.error !== 'no-speech') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            if (finalTranscriptStr.trim()) {
                onFinalResult(finalTranscriptStr.trim());
            }
            setInterimTranscript("");
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        setInterimTranscript("");
    }, [onFinalResult]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return { startListening, stopListening, isListening, interimTranscript };
}

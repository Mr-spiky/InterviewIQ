"use client";

import { useEffect, useRef, useState } from "react";
import { VideoOff, Video } from "lucide-react";

interface CameraFeedProps {
    /** Show a pulsing ring when the user is speaking */
    isSpeaking?: boolean;
}

export default function CameraFeed({ isSpeaking = false }: CameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [permitted, setPermitted] = useState<boolean | null>(null); // null = requesting

    useEffect(() => {
        let stream: MediaStream;
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((s) => {
                stream = s;
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                }
                setPermitted(true);
            })
            .catch(() => setPermitted(false));

        return () => {
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-dark-100 overflow-hidden">
            {/* Live camera */}
            {permitted === true && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]" // mirror effect
                />
            )}

            {/* Permission denied */}
            {permitted === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <VideoOff className="w-10 h-10 text-white/20" />
                    <p className="text-white/40 text-xs font-grotesk text-center px-4">
                        Camera access denied.<br />Allow camera in browser settings.
                    </p>
                </div>
            )}

            {/* Requesting... */}
            {permitted === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Video className="w-8 h-8 text-lime animate-pulse" />
                    <p className="text-white/40 text-xs font-grotesk">Requesting camera...</p>
                </div>
            )}

            {/* Speaking ring */}
            {isSpeaking && permitted === true && (
                <div className="absolute inset-0 border-4 border-lime animate-pulse pointer-events-none" />
            )}

            {/* Live indicator */}
            {permitted === true && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 px-2 py-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-[10px] font-grotesk font-bold uppercase">LIVE</span>
                </div>
            )}
        </div>
    );
}

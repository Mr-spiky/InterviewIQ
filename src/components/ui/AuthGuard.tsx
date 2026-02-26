"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Brain } from "lucide-react";

/**
 * AuthGuard — wraps protected pages.
 * Redirects to /login if no user session found.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-lime border-3 border-dark flex items-center justify-center animate-pulse">
                        <Brain className="w-6 h-6 text-dark" />
                    </div>
                    <p className="text-white/50 text-sm font-grotesk uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null; // redirect in progress

    return <>{children}</>;
}

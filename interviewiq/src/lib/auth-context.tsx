"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokenStore, type LoginResponse } from "@/lib/api";

type User = LoginResponse["user"];

interface AuthContext {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const Ctx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Restore session on mount
    useEffect(() => {
        const token = tokenStore.get();
        if (!token) { setIsLoading(false); return; }
        authApi.me()
            .then(setUser)
            .catch(() => tokenStore.clear())
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        tokenStore.set(data.access_token);
        setUser(data.user);
        router.push("/dashboard");
    }, [router]);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const data = await authApi.register(name, email, password);
        tokenStore.set(data.access_token);
        setUser(data.user);
        router.push("/dashboard");
    }, [router]);

    const logout = useCallback(() => {
        tokenStore.clear();
        setUser(null);
        router.push("/login");
    }, [router]);

    return (
        <Ctx.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </Ctx.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

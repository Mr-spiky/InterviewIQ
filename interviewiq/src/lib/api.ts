/**
 * Typed API client for the Python FastAPI backend.
 * All calls include the JWT token from session storage.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("iq_token");
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: { ...authHeaders(), ...(init.headers || {}) },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Network error" }));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type LoginResponse = {
    access_token: string;
    token_type: string;
    user: { id: string; name: string; email: string; created_at: string };
};

export const authApi = {
    register: (name: string, email: string, password: string) =>
        request<LoginResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        }),

    login: (email: string, password: string) =>
        request<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    me: () => request<LoginResponse["user"]>("/auth/me"),
};

// ─── Sessions ─────────────────────────────────────────────────────────────────

export type Session = {
    id: string;
    role: string;
    level: string;
    rounds: string[];
    status: "active" | "completed";
    created_at: string;
    overall_score?: number;
    question_count: number;
};

export const sessionsApi = {
    start: (formData: FormData) =>
        fetch(`${BASE}/sessions/start`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData, // multipart
        }).then(async (r) => {
            if (!r.ok) throw new Error((await r.json()).detail);
            return r.json() as Promise<Session>;
        }),

    list: () => request<Session[]>("/sessions"),

    get: (id: string) => request<Session>(`/sessions/${id}`),
};

// ─── Interview ────────────────────────────────────────────────────────────────

export type AIMessage = {
    id: string;
    session_id: string;
    role: "ai" | "user";
    content: string;
    score?: number;
    feedback?: string;
    weak_points?: string[];
    timestamp: string;
};

export type AITurn = {
    message: AIMessage;
    score?: number;
    feedback?: string;
    weak_points?: string[];
    is_follow_up: boolean;
    question_count: number;
};

export const interviewApi = {
    sendMessage: (session_id: string, content: string) =>
        request<AITurn>("/interview/message", {
            method: "POST",
            body: JSON.stringify({ session_id, content }),
        }),

    endSession: (session_id: string) =>
        request<{ message: string }>(`/interview/end/${session_id}`, { method: "POST" }),
};

// ─── Feedback ─────────────────────────────────────────────────────────────────

export type FeedbackReport = {
    session_id: string;
    role: string;
    level: string;
    rounds: string[];
    overall_score: number;
    category_scores: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
    recommendation: string;
    transcript: Array<{
        role: string;
        content: string;
        score?: number;
        feedback?: string;
        weak_points?: string[];
    }>;
};

export const feedbackApi = {
    generate: (session_id: string) =>
        request<FeedbackReport>(`/feedback/generate/${session_id}`, { method: "POST" }),

    get: (session_id: string) =>
        request<FeedbackReport>(`/feedback/${session_id}`),
};

// ─── Token helpers ─────────────────────────────────────────────────────────────

export const tokenStore = {
    set: (token: string) => sessionStorage.setItem("iq_token", token),
    clear: () => sessionStorage.removeItem("iq_token"),
    get: getToken,
};

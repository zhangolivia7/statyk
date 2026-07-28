"use client";

// a random per-device id, persisted locally, so focus session history can be
// grouped per-visitor without requiring an account/login
const STORAGE_KEY = "statyk_anon_id";

export function getAnonId(): string {
    if (typeof window === "undefined") return "";

    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
}

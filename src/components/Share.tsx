"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeRoomCode } from "@/lib/roomCode";

interface ShareProps {
    open: boolean;
    onClose: () => void;
    theme: "dark" | "light";
    roomCode: string;
}

export default function Share({ open, onClose, theme, roomCode }: ShareProps) {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState("");
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const fg = theme === "dark" ? "#F3EDE5" : "#0C0C0C";

    if (!open) return null;

    const shareLink = typeof window !== "undefined" ? `${window.location.origin}/${roomCode}` : `/${roomCode}`;

    const copy = async (text: string, flag: (v: boolean) => void) => {
        let ok = true;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // clipboard permission can be denied (e.g. non-HTTPS, browser policy) —
            // fall back to the legacy execCommand path instead of failing silently
            ok = fallbackCopy(text);
        }
        if (ok) {
            flag(true);
            setTimeout(() => flag(false), 1500);
        }
    };

    const join = () => {
        const code = normalizeRoomCode(joinCode);
        if (!code) return;
        onClose();
        router.push(`/${code}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                style={{
                    backgroundColor: theme === "dark" ? "#0C0C0C" : "#F3EDE5",
                    border: "2px solid #747474",
                    borderRadius: "10px",
                    width: "526px",
                    padding: "25px 55px 45px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "right" }}>
                    <button onClick={onClose} style={{ color: fg }}>
                        X
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    <h1 style={{ whiteSpace: "nowrap", fontSize: "24px", color: fg }}>
                        SHARE YOUR STATYK
                    </h1>

                    <div>
                        <h2 className="mb-5" style={{ color: "#747474" }}>
                            YOUR CODE
                        </h2>
                        <div className="flex gap-3">
                            <div
                                style={{
                                    flex: 1,
                                    height: "52px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #747474",
                                    borderRadius: "10px",
                                    letterSpacing: "4px",
                                    fontSize: "20px",
                                    color: fg,
                                }}
                            >
                                {roomCode}
                            </div>
                            <button
                                onClick={() => copy(roomCode, setCopiedCode)}
                                style={{
                                    height: "52px",
                                    padding: "0 20px",
                                    border: "1px solid #747474",
                                    borderRadius: "10px",
                                    color: fg,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {copiedCode ? "Copied!" : "Copy code"}
                            </button>
                        </div>
                        <button
                            onClick={() => copy(shareLink, setCopiedLink)}
                            style={{
                                marginTop: "12px",
                                width: "100%",
                                height: "52px",
                                border: "1px solid #747474",
                                borderRadius: "10px",
                                color: fg,
                            }}
                        >
                            {copiedLink ? "Link copied!" : "Copy link"}
                        </button>
                    </div>

                    <div>
                        <h2 className="mb-5" style={{ color: "#747474" }}>
                            JOIN A STATYK
                        </h2>
                        <div className="flex gap-3">
                            <input
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && join()}
                                placeholder="enter code"
                                style={{
                                    flex: 1,
                                    height: "52px",
                                    padding: "0 16px",
                                    border: "1px solid #747474",
                                    borderRadius: "10px",
                                    backgroundColor: "transparent",
                                    color: fg,
                                    fontSize: "18px",
                                    letterSpacing: "2px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={join}
                                style={{
                                    height: "52px",
                                    padding: "0 24px",
                                    border: "1px solid #747474",
                                    borderRadius: "10px",
                                    color: fg,
                                }}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function fallbackCopy(text: string): boolean {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
        ok = document.execCommand("copy");
    } catch {
        ok = false;
    }
    document.body.removeChild(textarea);
    return ok;
}

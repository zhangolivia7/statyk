"use client";

import { useState } from "react";

interface NotesProps {
    open: boolean;
    onClose: () => void;
    theme?: "dark" | "light";
}

export default function Notes({ open, onClose, theme = "dark" }: NotesProps) {
    const [text, setText] = useState("");

    const bg = theme === "dark" ? "#0C0C0C" : "#F3EDE5";
    const fg = theme === "dark" ? "#F3EDE5" : "#0C0C0C";

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                height: "100%",
                width: "360px",
                backgroundColor: bg,
                borderRight: "2px solid #747474",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transform: open ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
                zIndex: 40,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ fontSize: "20px", color: fg, margin: 0 }}>NOTES</h1>
                <button onClick={onClose} style={{ color: fg }}>
                    X
                </button>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="jot something down..."
                style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    border: "1px solid #747474",
                    borderRadius: "8px",
                    padding: "16px",
                    color: fg,
                    fontSize: "16px",
                    fontFamily: "inherit",
                    resize: "none",
                    outline: "none",
                }}
            />
        </div>
    );
}

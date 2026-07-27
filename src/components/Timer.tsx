"use client";

import { useEffect, useState } from "react";

interface TimerProps {
    pomodoroActive: boolean,
    durationMinutes: number,
    breakMinutes: number,
    onComplete: () => void,
    theme?: "dark" | "light",
}

const TOTAL_FOCUS_SESSIONS = 3;

function formatClock(date: Date) {
    const hours24 = date.getHours();
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours24 >= 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${period}`;
}

function formatCountdown(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Timer({ pomodoroActive, durationMinutes, breakMinutes, onComplete, theme = "dark" }: TimerProps) {
    const [now, setNow] = useState<Date | null>(null);
    const [phase, setPhase] = useState<"focus" | "break">("focus")
    const [focusCount, setFocusCount] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(
        durationMinutes * 60
    );

    // clock
    useEffect(() => {
        setNow(new Date());

        const id = setInterval(() => setNow(new Date()), 1000);

        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!pomodoroActive) return;

        let phase: "focus" | "break" = "focus";
        let focusCount = 0;
        let secondsLeft = durationMinutes * 60;

        setPhase(phase);
        setFocusCount(focusCount);
        setSecondsRemaining(secondsLeft);

        const id = setInterval(() => {
            secondsLeft -= 1;

            if (secondsLeft <= 0) {
                if (phase === "focus") {
                    focusCount += 1;
                    if (focusCount >= TOTAL_FOCUS_SESSIONS) {
                        clearInterval(id);
                        onComplete();
                        return;
                    }
                    phase = "break";
                    secondsLeft = breakMinutes * 60;
                } else {
                    phase = "focus";
                    secondsLeft = durationMinutes * 60;
                }
                setPhase(phase);
                setFocusCount(focusCount);
            }

            setSecondsRemaining(secondsLeft);
        }, 1000);

        return () => clearInterval(id);
    }, [pomodoroActive, durationMinutes, breakMinutes, onComplete]);

    const housingFill = theme === "dark" ? "#0C0C0C" : "#F3EDE5";
    const housingStroke = theme === "dark" ? "#F3EDE5" : "#0C0C0C";

    return (
        <div style={{ position: "relative", width: 396, height: 112 }}>
            <svg width="396" height="112" viewBox="0 0 396 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="393.581" height="109.095" rx="9" fill={housingFill} stroke={housingStroke} strokeWidth="2" />
            </svg>
            <p
                style={{
                    position: "absolute",
                    inset: 0,
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: pomodoroActive ? (phase === "focus" ? "#22C55E" : "#3B82F6") : housingStroke,
                }}
            >
                {pomodoroActive
                    ? formatCountdown(secondsRemaining)
                    : now ? formatClock(now) : "--:-- --"
                }
            </p>
        </div>
    )
}
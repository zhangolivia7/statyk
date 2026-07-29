"use client";

import { useEffect, useState } from "react";
import { playPomodoroSound } from "@/lib/playPomodoroSound";

interface TimerProps {
    pomodoroActive: boolean,
    durationMinutes: number,
    breakMinutes: number,
    // wall-clock time the session actually began — lets a peer who joins (or
    // reconnects) mid-session compute the true current phase/remaining time
    // instead of restarting the countdown from the full duration
    startedAt: number,
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

export default function Timer({ pomodoroActive, durationMinutes, breakMinutes, startedAt, onComplete, theme = "dark" }: TimerProps) {
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

    // driven by wall-clock timestamps rather than a decrementing counter, so
    // background-tab timer throttling can't make the countdown drift — each
    // tick (and each tab focus event) just recomputes remaining time from
    // Date.now(), and the while loop below catches up on any phase changes
    // that were missed while the tab was hidden (or, via startedAt, missed
    // entirely because we joined a session already in progress)
    useEffect(() => {
        if (!pomodoroActive) return;

        let phase: "focus" | "break" = "focus";
        let focusCount = 0;
        let phaseEnd = startedAt + durationMinutes * 60 * 1000;
        let stopped = false;

        // silently fast-forward through any phase transitions that already
        // happened between startedAt and now — this is what lets a peer who
        // joins mid-session land on the correct phase/remaining time instead
        // of restarting from the full duration
        const initialNow = Date.now();
        let caughtUp = false;
        while (initialNow >= phaseEnd) {
            caughtUp = true;
            if (phase === "focus") {
                focusCount += 1;
                if (focusCount >= TOTAL_FOCUS_SESSIONS) {
                    stopped = true;
                    break;
                }
                phase = "break";
                phaseEnd += breakMinutes * 60 * 1000;
            } else {
                phase = "focus";
                phaseEnd += durationMinutes * 60 * 1000;
            }
        }

        setPhase(phase);
        setFocusCount(focusCount);
        setSecondsRemaining(stopped ? 0 : Math.max(0, Math.ceil((phaseEnd - initialNow) / 1000)));

        if (stopped) {
            // the session had already fully finished by the time we started
            // watching it (e.g. joining long after everyone else wrapped up)
            playPomodoroSound("complete");
            onComplete();
            return;
        }

        // only chime for a phase we're genuinely present for the start of —
        // catching up silently avoids replaying a stack of past transitions
        if (!caughtUp) playPomodoroSound(phase);

        const tick = () => {
            if (stopped) return;
            const now = Date.now();

            while (now >= phaseEnd) {
                if (phase === "focus") {
                    focusCount += 1;
                    if (focusCount >= TOTAL_FOCUS_SESSIONS) {
                        stopped = true;
                        setPhase(phase);
                        setFocusCount(focusCount);
                        setSecondsRemaining(0);
                        playPomodoroSound("complete");
                        onComplete();
                        return;
                    }
                    phase = "break";
                    phaseEnd += breakMinutes * 60 * 1000;
                    playPomodoroSound("break");
                } else {
                    phase = "focus";
                    phaseEnd += durationMinutes * 60 * 1000;
                    playPomodoroSound("focus");
                }
            }

            setPhase(phase);
            setFocusCount(focusCount);
            setSecondsRemaining(Math.max(0, Math.ceil((phaseEnd - now) / 1000)));
        };

        const id = setInterval(tick, 1000);
        document.addEventListener("visibilitychange", tick);

        return () => {
            stopped = true;
            clearInterval(id);
            document.removeEventListener("visibilitychange", tick);
        };
    }, [pomodoroActive, durationMinutes, breakMinutes, startedAt, onComplete]);

    const housingFill = theme === "dark" ? "#0C0C0C" : "#F3EDE5";
    const housingStroke = theme === "dark" ? "#F3EDE5" : "#0C0C0C";
    const shadowColor = theme === "dark" ? "#F3EDE5" : "#0C0C0C";

    return (
        <div style={{ position: "relative", width: 396, height: 112 }}>
            <svg
                width="396"
                height="112"
                viewBox="0 0 396 112"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: `drop-shadow(0px 4px 5px ${shadowColor})` }}
            >
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
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SessionConfig, SessionPhase, SessionState } from "./types";

const initialState: SessionState = {
  phase: "idle",
  config: { focusMinutes: 25, breakMinutes: 5 },
  secondsRemaining: 0,
};

export function useSession() {
  const [state, setState] = useState<SessionState>(initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.secondsRemaining <= 1) {
        // phase transition: focus -> break -> complete
        if (prev.phase === "focus") {
          return {
            ...prev,
            phase: "break",
            secondsRemaining: prev.config.breakMinutes * 60,
          };
        }
        if (prev.phase === "break") {
          clearTick();
          return { ...prev, phase: "complete", secondsRemaining: 0 };
        }
      }
      return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
    });
  }, []);

  useEffect(() => {
    if (state.phase === "focus" || state.phase === "break") {
      clearTick();
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTick();
    }
    return clearTick;
  }, [state.phase, tick]);

  const start = (config: SessionConfig) => {
    setState({
      phase: "focus",
      config,
      secondsRemaining: config.focusMinutes * 60,
    });
  };

  const reset = () => {
    clearTick();
    setState(initialState);
  };

  return { state, start, reset };
}

export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/** yellow (focus) / blue (break) / green (complete) / cream (idle) */
export function phaseColor(phase: SessionPhase) {
  switch (phase) {
    case "focus":
      return "#e8c547";
    case "break":
      return "#5aa9e6";
    case "complete":
      return "#5ac47e";
    default:
      return "var(--color-cream)";
  }
}

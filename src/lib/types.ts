export type SessionPhase = "idle" | "focus" | "break" | "complete";

export type SessionConfig = {
  focusMinutes: number;
  breakMinutes: number;
};

export type SessionState = {
  phase: SessionPhase;
  config: SessionConfig;
  secondsRemaining: number;
};

/** A single tuning position on the channel dial. Each channel maps to a
 *  noise color (audio) and a visual "warmth" that tints the static grain. */
export type Channel = {
  id: string;
  label: string;
  noiseColor: "white" | "pink" | "brown";
  /** 0 = cold/blue static, 1 = warm/sepia static */
  warmth: number;
  description: string;
};

export const CHANNELS: Channel[] = [
  {
    id: "01",
    label: "CH 01",
    noiseColor: "white",
    warmth: 0.1,
    description: "clear static",
  },
  {
    id: "02",
    label: "CH 02",
    noiseColor: "pink",
    warmth: 0.45,
    description: "soft hum",
  },
  {
    id: "03",
    label: "CH 03",
    noiseColor: "brown",
    warmth: 0.75,
    description: "warm fuzz",
  },
  {
    id: "04",
    label: "CH 04",
    noiseColor: "pink",
    warmth: 0.25,
    description: "rain static",
  },
];

export const FOCUS_OPTIONS = [5, 25, 50] as const;
export const BREAK_OPTIONS = [5, 10, 15] as const;
